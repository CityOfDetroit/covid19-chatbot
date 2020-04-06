import React, { useState }from 'react';
import './App.scss';
import Card from '../Card/Card';
import Form from '../Form/Form';
import data from '../../data/App.steps.json';

function App() {
    const [step, setStep] = useState();
    const [formData, setFormData] = useState();
    const [buildType, setBuildType] = useState('application');

    const buildContent = () => {
        if(step != undefined){
            const markup = 
            <section id="App">
                <article className="Panel">
                {buildChat()}
                </article>
            </section>
            return markup;
        }else{
            return <section id="chatbot" onClick={startChatbot}><button><i className="fas fa-comment-dots"></i></button></section>
        }
    }

    const startChatbot = () => {
        setBuildType('application');
        setStep(0);
    }

    const closeChat = (e) => {
        e.preventDefault();
        setBuildType('application');
        setStep(undefined);
    }

    const buildHeader = (items) => {
        const markup = items.header.map((header) =>
            <div key={header.id} className="header">
                <p><img src={header.logoURL} alt={header.logoAlt}></img> <span>{header.text}</span></p>
                <form onSubmit={closeChat}>
                    <button>x</button>
                </form>
            </div>
        );
        return markup;
    }

    const buildChat = () => {
        const markup = 
        <article className="chat">
            {buildHeader(data[buildType][step].items)}
            <div className="conversation">
            {buildCards(data[buildType][step].items)}
            {buildForms(data[buildType][step].items)}
            </div>
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

