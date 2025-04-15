import './App.css';
import { useEffect, useState, Suspense, lazy, } from 'react';
import { useForm } from 'react-hook-form';
import CsvFileInput from './components/CsvFileInput';
import { FormControl, Grid, Paper, Button, Container, Pagination, Select, MenuItem, InputLabel, Typography, Backdrop, CircularProgress } from '@mui/material';
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
  const rowsPerPage = 50; // Adjust the number of rows per page as needed

  const [lang, setLang] = useState('ZH')

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
      setValue(`data.${(currentPage - 1) * rowsPerPage}.Target language (${lang})`, currentRow[`Target language (${lang})`] || '');
    }
  }, [currentPage, paginatedData, setValue, lang]);

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

  // console.log(watch('data'))

  return (
    <>
      <ResponsiveAppBar />
      <Container>

        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Typography>Select A language</Typography>
            <br />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Language</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={lang}
                label="Language"
                onChange={(e) => setLang(e.target.value)}
              >
                <MenuItem value={'ZH'}>ZH</MenuItem>
                <MenuItem value={'FR'}>FR</MenuItem>

              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <Typography>Select File to import</Typography>
            <CsvFileInput onFileLoad={handleFileLoad} />
          </Grid>
          <Grid item xs={4}>
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
          paginatedData.map((row, index) => {
            const idx = data.findIndex(r => r['ID (do not edit)'] === row['ID (do not edit)']);
            return (
              <Grid container key={idx} spacing={2}>
                <Grid item xs={2}>
                  <Typography variant="h5">{(currentPage - 1) * rowsPerPage + index + 1}</Typography>
                </Grid>
                <Grid item xs={5}>
                  <Paper>
                    <div dangerouslySetInnerHTML={{ __html: row['Source language (EN)'] || '' }} />
                  </Paper>
                </Grid>
                <Grid item xs={5}>
                  <Paper>
                    <Suspense fallback={<CircularProgress />}>
                      <SunEditorPage
                        initData={watch(`data.${idx}.Target language (${lang})`) || ''}
                        setValue={(value) => {
                          setValue(`data.${idx}.Target language (${lang})`, value)
                          // setValue(`data.${idx}.Target language (FR)`, value)
                        }}
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