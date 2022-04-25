import React from 'react';

export default function Messages({messages}) {

    const getColors = () => {
        const colors = [];
        while (colors.length < 100) {
            let color;
            do {
                color = Math.floor((Math.random()*1000000)+1);
            } while (colors.indexOf(color) >= 0);
            colors.push("#" + ("000000" + color.toString(16)).slice(-6));
        }
        console.log(colors);

        return colors
    }

    // const randomColors = getColors()
    const randomColors = ['#f08686', '#ac84e2', '#83dcb3', '#de6ce8', '#f2d256', '#ff9b68']

    const getUsers = (messages) => {
        const colors = {}
        const authors = [...new Set(messages.map(message => message.author))].map((author, i) => {
            colors[author] = randomColors[i]
            // colors[author] = Math.floor(Math.random()*16777215).toString(16)
        })

        return messages.map(message => ({
            ...message,
            color: colors[message.author]
        }))
    }


    return (
        <>
            <h2>Messages</h2>
            {getUsers(messages).reverse().map((message, i) =>
                {
                    const d = new Date(parseInt(message.timestamp) / 1000000)
                    let date = d.getDate();
                    let month = d.getMonth() + 1;
                    let year = d.getFullYear();
                    let hour = d.getHours();
                    let minute = d.getMinutes();
                    let second = d.getSeconds();
                    const formattedDate = `${date}.${month}.${year} ${hour}:${minute}:${second}`

                    return <div
                        key={i}
                        style={{ backgroundColor: message.color, padding: '5px', marginBottom: '5px' }}
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
