import { use, useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setErrors] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleInputChange = (e) => 
  {
    setInputText(e.target.value);
  }

  const handleDownload = async () => {
    const itemsToDownload = Object.keys(selectedItems).filter(downloadLink => selectedItems[downloadLink]);

    if (itemsToDownload.length === 0) {
      return;
    }

    setIsLoading(true);

   try{
         const response = await fetch('https://localhost:7032/Scraper/DownloadVideos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( itemsToDownload
        ),      
      });

      if (!response.ok) {
        throw new Error('Failed to download');
      }  
        setErrors(null);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'download.zip');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        setErrors('Error: ' + err.message);
      console.error('Error: ', err);
    } finally {
      setIsLoading(false);
    }
    
  }

  const handleSearchClick = async () =>
  {
    setIsLoading(true);
    try{
        const response = await fetch('https://localhost:7032/Scraper?subreddit='+inputText, 
        {
          method: 'GET',
          headers: {
                'Content-Type': 'application/json',
          },
        });

        if(!response.ok)
        {
           throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setTableData(data);
        setErrors(null);
    }
    catch(err){
      setErrors('Error: '+ err.message);
      console.error('Error: ', err);
    }
    finally{
      setIsLoading(false);
    }
  }

  const handleSelectItem = (downloadLink) => {
    setSelectedItems({
      ...selectedItems,
      [downloadLink]: !selectedItems[downloadLink]
    });

    if(selectAll && selectedItems[downloadLink] == true)
    {
      setSelectAll(false);
    }
  }

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelectedItems = {};
    tableData.forEach(item => {
      newSelectedItems[item.downloadLink] = newSelectAll;
    });
    setSelectedItems(newSelectedItems);
  }

  return (
    <div className="App">
      <div className="animated-background">
        <div className="gradient-blob"></div>
        <div className="gradient-blob"></div>
        <div className="gradient-blob"></div>
      </div>

      <div className="content">
        <h1>Input subreddit</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="input-container">
          <input type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter subreddit here"/>

        <button
        onClick={handleSearchClick}
        disabled={isLoading}>
          {isLoading ? 'Scraping' : 'Scrape'}
        </button>

        <button
          onClick={handleDownload}
          disabled={isLoading}>
          Download selected
        </button>
        </div>

        <div className="table-container">
          {isLoading && !tableData.length ? (
            <div className="loading">Loading data...</div>
          ) : (
          <table>
            <thead>
            <tr>
              <th className="select-column">
                <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}/>
              </th>
              <th>Upvotes</th>
              <th>NSFW</th>
              <th>Title</th>
              <th>Length (seconds)</th>
            </tr>
            </thead>
          <tbody>
            {tableData.sort(f => f.upvoteRatio).map((item) => (
              <tr key={item.id} className={selectedItems[item.downloadLink] ? "selected-row" : ""}>
                <td hidden>{item.downloadLink}</td>
                <td className="select-column">
                  <input
                  type="checkbox"
                  checked={selectedItems[item.downloadLink] || false}
                  onChange={() => handleSelectItem(item.downloadLink)}/>
                </td>
                <td>{item.upvoteRatio}</td>
                <td className="checkbox-cell">
                  <input
                  disabled
                  type="checkbox"
                  checked={item.isnsfw}/>
                </td>
                <td>{item.title}</td>
                <td>{item.mediaLength}</td>
              </tr>
            ))}
            {isLoading && tableData.length === 0 && (
               <tr>
               <td colSpan="4" className="no-data">No items found</td>
             </tr>
            )}
          </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
