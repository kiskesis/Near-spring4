import React from 'react';

export default function Messages({messages}) {
    return (
        <>
            <h2>Messages</h2>
            {messages.reverse().map((message, i) =>
                {
                    const d = new Date(parseInt(message.timestamp) / 1000000)
                    let date = d.getDate();
                    let month = d.getMonth() + 1;
                    let year = d.getFullYear();
                    let hour = d.getHours();
                    let minute = d.getMinutes();
                    let second = d.getSeconds();
                    const formattedDate = `${date}.${month}.${year} ${hour}:${minute}:${second}`
                    const randomColor = Math.floor(Math.random()*16777215).toString(16);

                    return <div
                        key={i}
                        style={{ backgroundColor: '#' + randomColor }}
                        className={message.deposit > 0 ? 'is-premium' : ''}
                    >
                        <strong>{message.author}</strong>:
                        <p className="message-info"><span>{message.message}</span><small>Was signed on: {formattedDate}</small></p>
                    </div>
                }
            )}
        </>
    );
}
