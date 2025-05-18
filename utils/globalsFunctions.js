export const generateHTMLTable = (dataList) => {
  // Get all unique properties of iterationData:
  const iterationDataKeys = new Set();

  dataList.forEach((item) => {
    Object.keys(item.iterationData).forEach((key) => {
      iterationDataKeys.add(key);
    });
  });

  // Convert the Set to Array to use in table creation:
  const columnNames = Array.from(iterationDataKeys);

  // Start creating the HTML:
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        table {
          border-collapse: collapse;
          width: 100%;
          font-family: Arial, sans-serif;
        }
        th, td {
          border: 1px solid #dddddd;
          text-align: left;
          padding: 8px;
        }
        th {
          background-color: #f2f2f2;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        tr:hover {
          background-color:rgb(151, 205, 231);
          transition: background-color 0.3s;
        }
      </style>
    </head>
    <body>
      <h2>Summary of Failures Table</h2>
      <p>Total failures: ${dataList.length}</p>
      <table>
        <tr>
    `;

  // CREATE COLUMNS FOR HTML:
  // Add the iterationData columns
  columnNames.forEach((column) => {
    html += `<th>${column}</th>`;
  });

  // Add the failedReason colums
  html += `<th>failedReason</th></tr>`;

  // Add data for each row:
  dataList.forEach((item) => {
    html += '<tr>';

    // Add the iterationData values
    columnNames.forEach((column) => {
      const value =
        item.iterationData[column] !== undefined
          ? item.iterationData[column]
          : '';
      html += `<td>${value}</td>`;
    });

    // Add the failedReason value
    html += `<td>${item.failedReason}</td>`;

    html += '</tr>';
  });

  html += `
      </table>
    </body>
    </html>
    `;

  return html;
};

// Function to send email with retry attempts:
export const sendEmailWithRetry = ({ transport, mailOptions }) => {
  let attempts = 3;
  let delay = 3000;
  let currentAttempt = 0;

  const attemptSend = () => {
    currentAttempt++;
    console.log(`Send attempt #${currentAttempt}...`);

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`Error sending (attempt ${currentAttempt}): ${error}`);

        // If there are still remaining attempts, retry after the delay
        if (currentAttempt < attempts) {
          console.log(`Retrying in ${delay / 1000} seconds...`);
          setTimeout(attemptSend, delay);
        } else {
          console.log(
            'Maximum number of attempts reached. The email could not be sent.'
          );
        }
      } else {
        console.log(
          `Email sent successfully on attempt ${currentAttempt}: ${info.response}`
        );
      }
    });
  };

  // First attempt
  attemptSend();
};
