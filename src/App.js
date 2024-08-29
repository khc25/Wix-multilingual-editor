import './App.css';
import { useEffect, useState, Suspense, lazy, } from 'react';
import { useForm } from 'react-hook-form';
import CsvFileInput from './components/CsvFileInput';
import { Grid, Paper, Button, Container, Pagination, Select, MenuItem, InputLabel, Typography, Backdrop, CircularProgress } from '@mui/material';
import CsvDownloadButton from 'react-json-to-csv'
import ResponsiveAppBar from './components/Bar';

const SunEditorPage = lazy(() => import('./components/SunEditor'));

function App() {
  const { setValue, watch } = useForm();

  const handleFileLoad = (csvData) => {
    setLoading(true);
    setValue('data', csvData);
    setLoading(false);
  };

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

  // console.log(data.length)

  const handlePageSelect = (event) => {
    setCurrentPage(event.target.value);
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
              <CsvDownloadButton data={watch('data')} />
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