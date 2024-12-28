require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require("./user.processor");
const user = new User();

class Subscription {
    constructor () {
        this.authPaypal = Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_CLIENT_SECRET).toString("base64");

        this.billingAgreementAttributes = (approval) => {
            return {
                plan_id: "P-0CF543466X3529703M5YDLJQ",
                application_context: {
                    brand_name: "NEX-System",
                    locate: "pt-PT",
                    user_action: "SUBSCRIBE_NOW",
                    payment_method: {
                        payer_selected: "PAYPAL",
                    },
                    return_url: `http://192.168.1.167:3000/subscribe/success?uuid=${approval}`,
                    cancel_url: "http://192.168.1.167:3000/subscribe/cancel",
                },
            }
        }
    };

    create = (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                const access_token = jwt.sign({ user: user.user }, process.env.SECRET);
                
                const response = await fetch('https://api.sandbox.paypal.com/v1/billing/subscriptions', {
                    method: 'POST',
                    body: JSON.stringify(this.billingAgreementAttributes(access_token)),
                    headers: {
                        'Authorization': `Basic ${this.authPaypal}`,
                        'Content-Type': 'application/json',
                    }
                })

                const session = await response.json();

                if (session.status === 'APPROVAL_PENDING') {
                    const approval_url = session.links.find(link => link.rel === 'approve').href;
                    resolve({ approval_url });
                }

                reject(session)
            }
            catch(err) { reject(err) }
        });
    };

    success = ({ subscription, u }) => {
        return new Promise(async (resolve, reject) => {
            user.subscribe({ id: u.user.id, subscription_id: subscription }) 
                .then(() => resolve({ subscription }))
                .catch((err) => reject(err))
        });
    };

    unsubscribe = ({ reason, u }) => {
        return new Promise(async (resolve, reject) => {~
            await user.find({ id: u.user.id })
                .then(async (dt) => {
                    try {
                        const response = await fetch(`https://api.sandbox.paypal.com/v1/billing/subscriptions/${dt.subscription_id}/cancel`, {
                            method: 'POST',
                            body: JSON.stringify({ reason }),
                            headers: {
                                'Authorization': `Basic ${this.authPaypal}`,
                                'Content-Type': 'application/json',
                            }
                        })
        
                        if (response.status === 204)
                            user.unsubscribe({ id: dt.id })
                                .then((status) => {
                                    resolve({status});
                                })
                        else
                            reject(response.json())
                    }
                    catch(err) { reject(err) }
                })
                .catch((err) => reject(err))
        });
    };

    getSubscriptionDetails = ({ u }) => {
        return new Promise(async (resolve, reject) => {~
            await user.find({ id: u.user.id })
                .then(async (dt) => {
                    if (dt.subscription_id !== null && dt.subscribed) {
                        try {
                            const response = await fetch(`https://api.sandbox.paypal.com/v1/billing/subscriptions/${dt.subscription_id}`, {
                                method: 'GET',
                                headers: {
                                    'Authorization': `Basic ${this.authPaypal}`,
                                    'Content-Type': 'application/json',
                                }
                            })
            
                            const subscription = await response.json();
    
                            resolve({subscription})
                        }
                        catch(err) { reject(err) }
                    }
                    else reject({
                        status: 400,
                        message: "You don't have any subscriptions active"
                    })
                    
                })
                .catch((err) => reject(err))
        });
    };
}

module.exports = Subscription;