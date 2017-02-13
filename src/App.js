import React, { Component } from 'react'
import './App.css'
import catLogo from './cat-pic.jpg'

export function RemainingAmount ({amountDonated, target}) {
    const invisible = (amountDonated === target) ? 'not-visible' : 'visible'
    return (
        <div className={invisible + ' fading'}>
            <div className='well still-left-well'>${target - amountDonated} still needed for the project.</div>
            <div className='arrow'></div>
        </div>
    )
}

export function TimeRemainingText ({isComplete}) {
    if (isComplete)
        return <p>Project funded!</p>

    return <p><em className='orange-text'>Only 3 days left</em> to fund this project.</p>
}

export function DonorsCounter ({numOfDonors, amountDonated, isComplete}) {
    if (isComplete)
        return <p><em>{numOfDonors}</em> {pluralisedDonor(numOfDonors)} donated</p>

    if (numOfDonors > 0)
        return <p>Join the <em>{numOfDonors}</em> other {pluralisedDonor(numOfDonors)} who donated <em>${amountDonated}.</em></p>

    return <p></p>
}

export function pluralisedDonor (numOfDonors) {
    return 'donor' + (numOfDonors > 1 ? 's' : '')
}

export function ProgressBar ({isComplete, percentDonated}) {
    const progressBarStyle = {width: percentDonated + '%'}
    const isCompleteClass = isComplete ? 'complete' : ''

    return (
        <div className='progress'>
            <div className={'progress-bar ' + isCompleteClass} style={progressBarStyle}></div>
        </div>
    )
}

class App extends Component {
    constructor () {
        super()
        this.state = {
            value: '',
            formValid: false,
            numOfDonors: 0,
            percentDonated: 0,
            amountDonated: 0,
            isComplete: false,
        }

        this.TARGET = 500
    }

    updateAmount (event) {
        const formValid = this.valueIsFiniteAndGreaterThanZero(event.target.value)

        this.setState({
            value: event.target.value,
            formValid,
        })
    }

    valueIsFiniteAndGreaterThanZero (value) {
        return isFinite(parseInt(value, 10)) && value > 0
    }

    updateDonation (event) {
        event.preventDefault()

        this.setState((prevState) => {
            let amountDonated = prevState.amountDonated + parseFloat(this.state.value)
            if (amountDonated > this.TARGET)
                amountDonated = this.TARGET

            const percentDonated = 100 * (amountDonated) / this.TARGET
            const isComplete = (percentDonated === 100)

            return {
                value: '',
                formValid: false,
                numOfDonors: prevState.numOfDonors + 1,
                amountDonated: Math.round(amountDonated),
                percentDonated,
                isComplete,
            }
        })
    }

    render () {
        return (
            <div className='App container'>
                <img className='logo' src={catLogo} alt='Cat working out using our fabolous cat trainer' />
                <p className='image-caption'>CatFit - an amazing product to make your cat strong!</p>

                <RemainingAmount amountDonated={this.state.amountDonated} target={this.TARGET}/>
                <ProgressBar isComplete={this.state.isComplete} percentDonated={this.state.percentDonated} />

                <main className='main-form'>
                    <TimeRemainingText isComplete={this.state.isComplete} />
                    <DonorsCounter numOfDonors={this.state.numOfDonors} amountDonated={this.state.amountDonated} isComplete={this.state.isComplete} />
                    <form className='form-inline' onSubmit={this.updateDonation.bind(this)}>
                        <div className='row'>
                            <div className='col-sm-6'>
                                <label htmlFor='donation' className='sr-only'>Donation amount</label>
                                <input id='donation' type='number' disabled={this.state.isComplete} className='input-lg form-control' value={this.state.value} onChange={this.updateAmount.bind(this)} />
                            </div>
                            <div className='col-sm-6'>
                                <button id='donate' className='btn btn-lg btn-success' disabled={!this.state.formValid}>Give now</button>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        )
    }
}

export default App
