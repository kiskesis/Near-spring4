import React from 'react';

export default function Messages({messages}) {
    console.log('messages', messages);
    return (
        <>
            <h2>Messages</h2>
            {messages.map((message, i) =>
                    // TODO: format as cards, add timestamp
                {
                    const d = new Date(parseInt(message.timestamp) / 1000000)
                    let date = d.getDate();
                    let month = d.getMonth() + 1;
                    let year = d.getFullYear();
                    let hour = d.getHours();
                    let minute = d.getMinutes();
                    let second = d.getSeconds();
                    const formattedDate = `${date}.${month}.${year} ${hour}:${minute}:${second}`

                    return <p
                        key={i}
                        className={message.deposit > 0 ? 'is-premium' : ''}
                    >
                        <strong>{message.author}</strong>:
                        <p className="message-info"><span>{message.message}</span><small>Was signed on: {formattedDate}</small></p>
                    </p>
                }
            )}
        </>
    );
}
