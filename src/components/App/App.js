import React, { useState }from 'react';
import './App.scss';
import Card from '../Card/Card';
import Form from '../Form/Form';
import data from '../../data/App.steps.json';

function App() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState();
    const [buildType, setBuildType] = useState('application');

    const buildContent = () => {
        const markup = 
        <section id="App">
            <article className="Panel">
            {buildChat()}
            {buildForms(data[buildType][step].items)}
            </article>
        </section>
        return markup;
    }

    const closeChat = (e) => {
        e.preventDefault();
        setStep(0);
    }

    const buildHeader = () => {
        if(step > 0){
            return (
            <div className="header">
                <p><img src="https://detroitmi.gov/themes/custom/detroitmi/logo-white.png" alt="City of Detroit"></img> <span>Coronavirus Self-Checker</span></p>
                <form onSubmit={closeChat}>
                    <button>x</button>
                </form>
            </div>
            )
        }
    }

    const buildChat = () => {
        const markup = 
        <article className="chat">
            {buildHeader()}
            {buildCards(data[buildType][step].items)}
        </article>
        return markup;
    }

    const buildCards = (items) => {
        const markup = items.cards.map((card) =>
            <Card  
                key={card.id} 
                type={card.type} 
                title={card.title.value} 
                titleType={card.title.type} 
                body={card.body.markup} 
                bodyType={card.body.type}>
            </Card>
        );
        return markup;
    }

    const buildForms = (items) => {
        const markup = items.forms.map((form) =>
            <Form  
                key={form.id} 
                type={form.type}
                position={form.position}  
                requirements={form.requirements}
                text={form.text}
                sections={form.sections}
                state={{ formData: [formData, setFormData], step: [step, setStep], buildType: [buildType, setBuildType] }}>
            </Form>
        );
        return markup;
    }

    return(
        buildContent()
    )
}

export default App;

