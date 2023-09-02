export default function Table(props) {

    const columns = props.columns;
    const rows = props.rows;
    return (
        <table className="table" style={{ padding: "20px 20px 20px 20px" }}>
            <thead>
                <tr>
                    {
                        columns.map((col, idx) => {
                            return <th key={idx}>{col.header}</th>
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {
                    rows.map((row, rId) => {

                        return <tr key={rId} style={{ height: "54px" }} >
                            {

                                columns.map((col, cId) => {
                                    return <td key={`${rId}-${cId}`}>{col.render(row)}</td>
                                })

                            }
                        </tr>
                    })
                }

            </tbody>
        </table>
    )


}