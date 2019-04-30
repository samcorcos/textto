const {
    stripeSecretKey,
    stripeSecretKeyTest
} = require('../../credentials/stripe')

const stripeKey = (process.env.NODE_ENV === 'production') ? stripeSecretKey : stripeSecretKeyTest

class Stripe {

    constructor(STRIPE_SKEY) {
        this.stripe = require('stripe')(STRIPE_SKEY)
    }


    async createProduct(name, type) {
        const product = await this.stripe.products.create({
            name,
            type
        })
        return product
    }


    async createPlan(productId, plan, currency = 'usd', interval = 'month') {

        const _plan = await this.stripe.plans.create({
            currency,
            interval,
            product: productId,
            nickname: plan.name,
            amount: plan.amount
        })

        return _plan
    }


    async getCustomer(customerId) {
        const customer = await this.stripe.customers.retrieve(customerId)
        return customer
    }


    async createCustomer(token, email) {
        const customer = await this.stripe.customers.create({
            email,
            source: token
        })
        return customer
    }


    async subscribe(planId, customerId) {

        const subscription = await this.stripe.subscriptions.create({
            customer: customerId,
            items: [{
                plan: planId
            }]
        })

        return subscription
    }


    async unsubscribe(subscriptionId) {
        return await this.stripe.subscriptions.del(subscriptionId)
    }


    async changeSubscription(subscriptionId, newPlanId) {
        const subscription = await this.stripe.subscriptions.retrieve(subscriptionId)
        const updatedSubscription = await this.stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: false,
            items: [{
                id: subscription.items.data[0].id,
                plan: newPlanId,
            }]
        })
        return updatedSubscription
    }
}

module.exports = {
    stripe: new Stripe(stripeKey)
}