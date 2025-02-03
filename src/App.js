import './App.css';
import { useEffect, useState, Suspense, lazy, } from 'react';
import { useForm } from 'react-hook-form';
import CsvFileInput from './components/CsvFileInput';
import { Grid, Paper, Button, Container, Pagination, Select, MenuItem, InputLabel, Typography, Backdrop, CircularProgress } from '@mui/material';
// import CsvDownloadButton from 'react-json-to-csv'
import Papa from 'papaparse'
import ResponsiveAppBar from './components/Bar';

const SunEditorPage = lazy(() => import('./components/SunEditor'));

function App() {
  const { setValue, watch } = useForm();

  const handleFileLoad = (csvData) => {
    setLoading(true);
    setValue('data', csvData);
    setLoading(false);
  };
  // const handleFileLoad = (csvData) => {
  //   setLoading(true);

  //   // Map through the csvData to parse the keys that need to be objects
  //   const parsedData = csvData.map((row) => {
  //     return {
  //       ...row,
  //       "ID (do not edit)": JSON.parse(row["ID (do not edit)"]),
  //       // Parse other fields as necessary
  //       "Source language (EN)": row["Source language (EN)"], // keep as is if it's not a JSON string
  //       "Target language (ZH)": row["Target language (ZH)"], // keep as is if it's not a JSON string
  //     };
  //   });

  //   setValue('data', parsedData);
  //   setLoading(false);
  // };

  const [loading, setLoading] = useState(false);

  const data = watch('data') || [];
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Adjust the number of rows per page as needed

  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, (currentPage - 1 + 1) * rowsPerPage);


  const [totalPages, setTotalPage] = useState();

  useEffect(() => {
    setTotalPage(Math.ceil(data.length / rowsPerPage));
  }, [data.length])


  const handleChange = (event, value) => {
    setCurrentPage(value);
  };


  useEffect(() => {
    if (paginatedData.length > 0) {
      const currentRow = paginatedData[0]; // Get the first row of the current page
      setValue(`data.${(currentPage - 1) * rowsPerPage}.Target language (ZH)`, currentRow['Target language (ZH)'] || '');
    }
  }, [currentPage, paginatedData, setValue]);

  /* The `console.log(data)` statement in the code is logging the `data` variable to the console. This
  can be helpful for debugging purposes or to understand the structure and content of the `data`
  variable at that point in the code execution. It allows developers to inspect the data and see its
  values, which can be useful for troubleshooting or verifying the data being used in the
  application. */
  // console.log(data)

  const handlePageSelect = (event) => {
    setCurrentPage(event.target.value);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(watch('data'));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <ResponsiveAppBar />
      <Container>

        <Grid container>
          <Grid item xs={6}>
            <Typography>Select File to import</Typography>
            <CsvFileInput onFileLoad={handleFileLoad} />
          </Grid>
          <Grid item xs={6}>
            <Typography>Export file</Typography>
            {
              data.length > 0 &&
              <button onClick={handleDownload}>Download CSV</button>
            }

          </Grid>
        </Grid>

        <div style={{ paddingTop: '5%', paddingBottom: '5%' }}>
          {
            data.length > 0 &&
            <Grid container>
              <Grid item xs={6}>
                <Pagination count={totalPages} page={currentPage} onChange={handleChange} showFirstButton showLastButton />
              </Grid>
              <Grid item xs={6}>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Go To Page
                </InputLabel>
                <Select label={'Go To Page'} value={currentPage} onChange={handlePageSelect} style={{ width: '100%' }}>
                  {
                    Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <MenuItem key={p} value={p}>{p}</MenuItem>
                    ))
                  }
                </Select>
              </Grid>
            </Grid>
          }

        </div>
        {paginatedData && paginatedData.length > 0 ? (
          paginatedData.map((row) => {
            const idx = data.findIndex(r => r['ID (do not edit)'] === row['ID (do not edit)']);
            return (
              <Grid container key={idx} spacing={2}>
                <Grid item xs={6}>
                  <Paper>
                    <div dangerouslySetInnerHTML={{ __html: row['Source language (EN)'] || '' }} />
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper>
                    <Suspense fallback={<CircularProgress />}>
                      <SunEditorPage
                        initData={watch(`data.${idx}.Target language (ZH)`) || ''}
                        setValue={(value) => setValue(`data.${idx}.Target language (ZH)`, value)}
                      />
                    </Suspense>
                  </Paper>
                </Grid>
              </Grid>
            );
          })
        ) : null}
        {/* <div>
        <Button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous
        </Button>
        <Button onClick={handleNextPage} disabled={(currentPage + 1) * rowsPerPage >= data.length}>
          Next
        </Button>
      </div> */}
        <div style={{ paddingTop: '5%', paddingBottom: '5%' }}>
          {
            data.length > 0 &&
            <Grid container>
              <Grid item xs={6}>
                <Pagination count={totalPages} page={currentPage} onChange={handleChange} showFirstButton showLastButton />
              </Grid>
              <Grid item xs={6}>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Go To Page
                </InputLabel>
                <Select label={'Go To Page'} value={currentPage} onChange={handlePageSelect} style={{ width: '100%' }}>
                  {
                    Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <MenuItem key={p} value={p}>{p}</MenuItem>
                    ))
                  }
                </Select>
              </Grid>
            </Grid>
          }
        </div>

      </Container>
      <Paper>
        <div style={{ padding: '10px', textAlign: 'center' }}>
          <pre> Copyright © 2024 All right reserved</pre>
        </div>
      </Paper>
      <Backdrop sx={{ color: '#fff', zIndex: 999 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default App;