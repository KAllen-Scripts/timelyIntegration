const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

function getTicketTitle(ticketNumber) {
    return axios.request({
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.groovehq.com/v1/tickets/${ticketNumber}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROOVE_ACCESS_TOKEN}`
        }
    }).then(response => {
        return response.data.ticket.title
    })
}

function getCustomerId(ticketNumber) {
    return axios.request({
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.groovehq.com/v2/graphql',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROOVE_ACCESS_TOKEN}`
        },
        data: {
            query: `query CustomerDetailsByTicketNumber {
            conversation(number: ${ticketNumber}) {
            contact {
                customFieldValues {
                nodes {
                    id
                    customField {
                        key
                        isArray
                    }
                    value {
                    ... on Text {
                        content
                    }
                    }
                }
                }
            }
            }
        }`
        }
    }).then(response => {
        for (const field of response.data.data.conversation.contact.customFieldValues.nodes) {
            if (field.customField.key == 'contact_company_id') {
                return field.value.content
            }
        }
        return null
    })
}

module.exports = {
    getTicketTitle,
    getCustomerId
}