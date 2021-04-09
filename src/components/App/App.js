import React, { useState }from 'react';
import './App.scss';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import Card from '../Card/Card';
import Form from '../Form/Form';
import data from '../../data/web.steps.json';

const lng = 'en';

function App() {
    const [appID, setAppID]             = useState();
    const [stepHistory, setStepHistory] = useState([]);
    const [step, setStep]               = useState();
    const [formData, setFormData]       = useState();
    const [buildType, setBuildType]     = useState('application');
    const [btnState, setbtnState]       = useState();
    const [hint, setHint]               = useState();
    const [language, setLanguage]       = useState(lng);
    const textLng = {
        backButton: {
            en: "Back",
            es: "Atras",
            bn: "Bengali",
            ar: "Arabic"
        }
    }

    const buildContent = () => {
        if(step != undefined){
            const markup = 
            <ErrorBoundary>
                <section id="App">
                    <article className="Panel">
                        {buildChat()}
                    </article>
                </section>
            </ErrorBoundary>
            return markup;
        }else{
            return <section id="chatbot" onClick={startChatbot}><button><i className="fas fa-comment-dots"></i><small>Chat</small></button></section>
        }
    }

    const startChatbot = () => {
        setBuildType('application');
        setStep(0);
    }

    const restartApp = (e) => {
        e.preventDefault();
        if(btnState == 'x') {
            setAppID(undefined);
            setStepHistory([]);
            setFormData(undefined);
            setBuildType('application');
            setStep(undefined);
        }else{
            if(stepHistory[stepHistory.length - 1] == 0){
                setAppID(undefined);
            }
            let tempStep = stepHistory[stepHistory.length - 1];
            let tempHistory = stepHistory;
            tempHistory.pop();
            setStepHistory(tempHistory);
            setStep(tempStep);
        }
    }

    const buildHeader = (items) => {
        const markup = items.header.map((header) =>
            <div key={header.id} className="header">
                <p><img src={header.logoURL} alt={header.logoAlt}></img> <span>{header.text[language]}</span></p>
                <form onSubmit={restartApp}>
                    {(step > 0) ? <button className="back" onClick={(e)=>{setbtnState(e.target.innerText)}}><span>&laquo;</span> {textLng.backButton[language]}</button> : ""}
                    <button className="restart" onClick={(e)=>{setbtnState(e.target.innerText)}}>x</button>
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
                language={language}
                title={card.title.value[language]} 
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
                id={form.id}
                savedData={form.savedData}
                key={form.id} 
                type={form.type}
                language={language}
                position={form.position}  
                requirements={form.requirements}
                text={form.text}
                sections={form.sections}
                state={{ formData: [formData, setFormData], step: [step, setStep], stepHistory: [stepHistory, setStepHistory], buildType: [buildType, setBuildType], appID: [appID, setAppID] }}>
            </Form>
        );
        return markup;
    }

    return(
        buildContent()
    )
}

export default App;