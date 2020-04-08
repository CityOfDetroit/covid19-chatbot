import React from 'react';
import './Body.scss';

function Body(props) {
    const buildContent = () => {
        const markup = props.content.map((item) =>
            buildItem(item)
        );
        return markup;
    }

    const buildItem = (item) => {
        switch (item.tag) {
            case 'a':
                return <item.tag key={item.id} href={item.link} target='_blank'>{item.content}</item.tag>
                break;

            case 'ul':
                return <item.tag key={item.id}>{buildList(item.content)}</item.tag>
                break;
        
            default:
                return <item.tag key={item.id}>{item.content}</item.tag>
                break;
        }
    }

    const buildList = (items) => {
        const markup = items.map((item) =>
            <li key={item.id}>
                {buildItem(item)}
            </li>
        );
        return markup
    }

    const buildBody = () => {
        let bodyType = "Card-Body";
        if (props.type){
            bodyType += ` ${props.type}`;
            return (
                <article className={bodyType}>
                    {buildContent()}
                </article>
            )
        }else{
            return ""
        }
    }

    return(
        buildBody()
    )
}

export default Body;
