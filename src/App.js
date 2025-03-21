import { useState } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [tableData, setTableData] = useState([
    { id: 0, upvotes: 60, nsfw: false, title: 'Item 1', length: '07:12' },
    { id: 1, upvotes: 67, nsfw: true, title: 'Item 2', length: '00:13' },
  ]);

  const handleInputChange = (e) => 
  {
    setInputText(e.target.value);
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

        <div className="input-container">
          <input type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter subreddit here"/>
        <button>Scrape</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
            <tr>
              <th>Upvotes</th>
              <th>NSFW</th>
              <th>Title</th>
              <th>Length</th>
            </tr>
            </thead>
          <tbody>
            {tableData.sort(f => f.upvotes).map((item) => (
              <tr key={item.id}>
                <td>{item.upvotes}</td>
                <td className="checkbox-cell">
                  <input
                  disabled
                  type="checkbox"
                  checked={item.nsfw}/>
                </td>
                <td>{item.title}</td>
                <td>{item.length}</td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
