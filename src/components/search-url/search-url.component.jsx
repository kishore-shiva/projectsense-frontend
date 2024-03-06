import React, { useContext, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { signOutFromApp } from "../../utils/firebase/firebase.utils"
import { UserContext, CreditContext, SubscriptionContext } from "../../context/user.context";
import './search-url.styles.scss'
import { useNavigate } from "react-router-dom";

const SearchUrl = () => {
    const { currentUser } = useContext(UserContext)
    const { credit, setCredit } = useContext(CreditContext)
    const { setSubscription } = useContext(SubscriptionContext)
    const [data, setData] = useState(null)
    const [csvresult, setCSVResult] = useState([])
    const [url, setUrl] = useState(null)
    const [csvFile, setCsvFile] = useState("")
    const [fileDownloaded, setFileDownloaded] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {

            if (currentUser && currentUser.uid) {
                try {
                    const response = await fetch('http://localhost:5500/check-credit?userId=' + currentUser.uid, {
                        method: 'POST',
                        headers: {
                            'Content-type': "application/json"
                        }
                    });
                    const data = await response.json();
                    setCredit(data.user_credit);
                } catch (error) {
                    console.error('Error fetching credit:', error);
                }
            }
        };

        fetchData();

    }, [data, csvresult, currentUser, credit, setCredit]);

    const getResult = async () => {
        if (credit === "0") {
            alert("insufficient credit. Upgrade to premium")
            return;
        }
        await fetch("http://localhost:5500/api/url?userUrl=" + encodeURIComponent(url) + "&userId=" + currentUser?.uid, {
            headers: {
                "Content-type": "application/json"
            }
        }).then(response =>
            response.ok ? response.json() : response.json().then(data => Promise.reject(data)))
            .then(async (data) => {
                setData(data)
            }
            ).catch(error => {
                console.log(error)
                alert(error.error)}
            )

    }

    const handleUrl = (e) => {
        setUrl(e.target.value)
    }

    const handleCSVFileUpload = (event) => {
        const file = event.target.files[0];
        setCsvFile(file)
    }

    const resetField = () => {
        setUrl(null)
        setData(null)
        setCSVResult([])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (credit === "0") {
            alert("insufficient credit. Upgrade to premium")
            return;
        }

        const formData = new FormData()
        formData.append('csvFile', csvFile)
        formData.append('userId', currentUser?.uid)

        await fetch("http://localhost:5500/api/csv", {
            method: "POST",
            body: formData
        }).then(response =>
            response.ok ? response.json() : response.json().then(data => setData(data)))
            .then(async (data) => {
                setCSVResult(data)
            }
            ).catch(error => console.log(error))
    }

    const handleDownload = async () => {
        setFileDownloaded(false)
        try {
            const response = await fetch('http://localhost:5500/download');
            const blob = await response.blob();

            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = 'Output.csv';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div className="search-url-container">
            <h1 className="dashboard-head">Find the Technologies Here</h1>
            <div className="search-form">
                <input type="search" name="searchUrl" id="search-url" onChange={handleUrl} placeholder="Enter URL" />
                <button onClick={getResult} className="submit-button">Submit</button>
                <button onClick={resetField} className="reset-button">Reset</button>
                {credit === "0" ? <button className="submit-button" onClick={() => {
                    setSubscription(false)
                    navigate("/upgrade")
                }}>Upgrade</button> : null}
            </div>

            {data || csvresult.length !== 0 ? (
                <table className="result-table">
                    <tbody>
                        {data ? (
                            Object.entries(data).map(([category, items]) => (
                                <React.Fragment key={uuidv4()}>
                                    {category === "URL" ? (
                                        <tr key={uuidv4()}>
                                            <td colSpan="2">{items}</td>
                                        </tr>
                                    ) : (
                                        <React.Fragment>
                                            <tr key={uuidv4()}>
                                                <td colSpan="2" className="category-header">{category}</td>
                                            </tr>
                                            {items.map((item) => (
                                                <tr key={uuidv4()}>
                                                    <td className="technology-name">{item.name}</td>
                                                    <td className="technology-description">{item.description}</td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            Object.entries(csvresult.message).map(([mainCategory, items]) => (
                                Object.entries(items).map(([category, item]) => (
                                    category === "URL" ? (
                                        <tr key={uuidv4()}>
                                            <td className="url-header">{item}</td>
                                        </tr>
                                    ) : (
                                        category !== "error" ? (
                                            <tr className="row" key={uuidv4()}>
                                                <td className="category-header">{category}</td>
                                                {Object.entries(item).map((entry) => (
                                                    entry[0] !== "error" ? (
                                                        entry.map((i) => (
                                                            <tr key={uuidv4()}>
                                                                <td className="technology-name">{i.name}</td>
                                                                <td className="technology-description">{i.description}</td>
                                                            </tr>
                                                        ))
                                                    ) : null
                                                ))}
                                            </tr>
                                        ) : <tr></tr>
                                    )
                                ))
                            ))
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            ) : (
                <table></table>
            )}

            <form onSubmit={handleSubmit} className="file-upload-form">
                <label htmlFor="csvFile">Choose a CSV file:</label>
                <input type="file" id="csvFile" name="csvFile" accept=".csv" required onChange={handleCSVFileUpload} />
                <input type="submit" value="Submit" />
                <button onClick={handleDownload} className="submit-button" disabled={fileDownloaded}>
                    Download File
                </button>
            </form>

            <button onClick={signOutFromApp} className='sign-out-btn'>
                Sign Out
            </button>
        </div>


    )
}

export default SearchUrl