import { useState, useEffect } from 'react';
import { Sheet2JSONOpts } from 'xlsx';
import axios from 'axios';

type FileExtension = 'xlsx' | 'xls' | 'json' | 'csv';

const useFileLoader = (fileName: string, excelOption?: Sheet2JSONOpts) => {
  const [data, setData] = useState<object[]>([]);
  const [dataLoading, setLoading] = useState<boolean>(false);
  const [dataError, setError] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const loadData = async () => {
      setLoading(true);

      try {
        // eslint-disable-next-line fp/no-mutating-methods
        const extension: FileExtension = fileName
          .split('.')
          .pop()
          ?.toLowerCase() as FileExtension;
        switch (extension) {
          case 'xlsx':
          case 'xls': {
            const { read, utils } = await import('xlsx');
            const f = await (
              await axios
                .get(fileName, { responseType: 'blob', signal: signal })
                .then((response) => response.data)
            ).arrayBuffer();
            const wb = read(f); // parse the array buffer
            const ws = wb.Sheets[wb.SheetNames[0]]; // get the first sheet by default
            const data = utils.sheet_to_json(ws, excelOption) as object[]; // generate objects
            setData(data);
            setLoading(false);
            break;
          }
          case 'json': {
            const { data } = await axios.get(fileName, { signal: signal });
            setData(data);
            setLoading(false);
            break;
          }
          case 'csv': {
            const { csvParse } = await import('d3');
            const { data } = await axios.get(fileName, {
              responseType: 'blob',
              signal: signal
            });
            const csvData = await data
              .text()
              .then((csvStr) => csvParse(csvStr));
            setData(csvData);
            setLoading(false);
            break;
          }
          default: {
            throw new Error('Unsupported file extension.');
          }
        }
      } catch (error) {
        setData([]);
        setLoading(false);
        setError(true);
      }
    };

    loadData();

    return () => {
      controller.abort();
    };
  }, [fileName, excelOption]);

  return { data, dataLoading, dataError };
};

export default useFileLoader;
