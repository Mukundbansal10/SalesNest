import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [result, setResult] = useState('');

  const handleSearch = async () => {
    const res = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Best sales strategy?" }]
    }, {
      headers: {
        Authorization: `Bearer YOUR_API_KEY`
      }
    });

    setResult(res.data.choices[0].message.content);
  };

  return (
    <div>
      <button onClick={handleSearch}>Search GPT</button>
      <p>{result}</p>
    </div>
  );
};

export default Search;
