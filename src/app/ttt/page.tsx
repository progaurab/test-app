"use client";

import { useMemo, useState } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import * as XLSX from 'xlsx';

export default function TTT() {
  const [searchOption, setSearchOption] = useState('Account Number');
  const [accountNumber, setAccountNumber] = useState('');
  const [fetchSince, setFetchSince] = useState('3m');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const response = await axios.post('http://localhost:5000/raptor/ttt', {
      flag: '',
      targetAcct: accountNumber,
      startDate,
      endDate,
    });
    setData(response.data);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'data.xlsx');
  };

  // Use useMemo to prevent unnecessary re-renders
  const columns = useMemo(() => [
    { Header: 'GUT MATCH', accessor: 'GUT_MATCH' },
    { Header: 'ACCOUNT', accessor: 'ACCOUNT' },
    { Header: 'AMOUNT', accessor: 'AMOUNT' },
    { Header: 'CASH', accessor: 'CASH' },
  ], []);

  const memoizedData = useMemo(() => data, [data]);

  const tableInstance = useTable({ columns, data: memoizedData });

  return (
    <div>
      <div className="space-y-4">
        <select value={searchOption} onChange={e => setSearchOption(e.target.value)}>
          <option>Account Number</option>
          <option>Customer Number</option>
        </select>
        <input
          type="number"
          placeholder={searchOption}
          value={accountNumber}
          onChange={e => setAccountNumber(e.target.value)}
        />
        <select value={fetchSince} onChange={e => setFetchSince(e.target.value)}>
          <option>3m</option>
          <option>6m</option>
          <option>Custom Date</option>
        </select>
        {fetchSince === 'Custom Date' && (
          <>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </>
        )}
        <button onClick={fetchData}>Trace</button>
        <button onClick={exportToExcel}>Export to Excel</button>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.accessor}>{col.Header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {memoizedData.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col.accessor}>{row[col.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
