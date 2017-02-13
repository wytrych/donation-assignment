/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import ReactTestUtils from 'react-addons-test-utils'
import { mount } from 'enzyme'

import App, {
    RemainingAmount,
    pluralisedDonor,
    ProgressBar,
} from './App'

function render (component) {
    const renderer = ReactTestUtils.createRenderer()
    renderer.render(component)
    return renderer.getRenderOutput()
}

describe('App', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div')
        ReactDOM.render(<App />, div)
    })

    it('has basic validation', () => {
        const app = mount(<App />)

        const input = app.find('input')
        const submitBtn = app.find('button').node

        input.node.value = -1
        input.simulate('change')
        expect(submitBtn.disabled).toBe(true)

        input.node.value = 'abc'
        input.simulate('change')
        expect(submitBtn.disabled).toBe(true)

        input.node.value = 100
        input.simulate('change')
        expect(submitBtn.disabled).toBe(false)
    })

    it('should increment the number of donors and donation amount and update isComplete property', () => {
        const app = mount(<App />)

        const input = app.find('input')
        const form = app.find('form')

        expect(app.state('numOfDonors')).toBe(0)
        expect(app.state('amountDonated')).toBe(0)
        expect(app.state('isComplete')).toBe(false)

        input.node.value = 100
        input.simulate('change')
        form.simulate('submit')

        expect(app.state('numOfDonors')).toBe(1)
        expect(app.state('amountDonated')).toBe(100)
        expect(app.state('isComplete')).toBe(false)

        input.node.value = 500
        input.simulate('change')
        form.simulate('submit')

        expect(app.state('isComplete')).toBe(true)

    })

})

describe('RemainingAmount', () => {
    it('has the correct class name when target is not reached', () => {
        const result = render(<RemainingAmount amountDonated='10' target='20' />)
        expect(result.props.className).toContain('visible')
        expect(result.props.className).not.toContain('not-visible')
    })

    it('has the correct class name when target is reached', () => {
        const result = render(<RemainingAmount amountDonated='10' target='10' />)
        expect(result.props.className).toContain('not-visible')
    })

})

describe('pluralisedDonor', () => {

    it('should pluralise donors correctly', () => {
        expect(pluralisedDonor(1)).toBe('donor')
        expect(pluralisedDonor(2)).toBe('donors')
    })

})

describe('ProgressBar', () => {

    it('should have the correct class and style when donation is NOT complete', () => {
        const isComplete = false
        const result = render(<ProgressBar isComplete={isComplete} percentDonated='20' />)
        expect(result.props.children.props.className).not.toContain('complete')
        expect(result.props.children.props.style).toEqual({width: '20%'})
    })

    it('should have the correct class and style when donation is complete', () => {
        const isComplete = true
        const result = render(<ProgressBar isComplete={isComplete} percentDonated='100' />)
        expect(result.props.children.props.className).toContain('complete')
        expect(result.props.children.props.style).toEqual({width: '100%'})
    })

})
