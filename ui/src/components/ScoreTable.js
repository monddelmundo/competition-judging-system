import React from 'react'
import Table from 'react-bootstrap/Table';

export const ScoresheetTbl = ({rows, cols}) => {

    const ScoresheetTable = rows.map((row, index) => {
        
        return (
            <tr key = {index} className='even'>
                <td>{row.type}</td>
                <td>{row.title}</td>
                <td>{row.criterias}</td>
                <td>{row.pct}</td>
                <td>{row.score}</td>
                <td>{row.total}</td>
                <td>{row.overall}</td>
                <td>{row.overallTotal}</td>
            </tr>
        )
    })
    
    const tableHeader = cols.map((col) => (
        <thead className='bgvi'>
            <tr>
                <th>{col.type}</th>
                <th>{col.title}</th>
                <th>{col.criterias}</th>
                <th>{col.pct}</th>
                <th>{col.score}</th>
                <th>{col.total}</th>
                <th>{col.overall}</th>
                <th>{col.overallTotal}</th>
            </tr>
        </thead>
    ))
    
    return (
        <Table striped bordered hover>
            {tableHeader}
            <tbody>
                {ScoresheetTable}
            </tbody>
        </Table>
    )
}