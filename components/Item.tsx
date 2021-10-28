import { NextPage } from "next";
import { Task } from "../types/Task";

/* eslint-disable @next/next/no-img-element */

type ItemProps = {
    task : Task
}

const Item: NextPage<ItemProps> = ({
    task
}) => {

    const getDateText = (finishDate : any, finishPrevisionDate : any) => {
        if(finishDate){
            const fd = new Date(finishDate)
            return `Concluido em: ${fd.getDay() + '/' + fd.getMonth() + '/' + fd.getFullYear()}`;
        }
        
        const fpd = new Date(finishPrevisionDate)
        return `Previsao de conclusao em: ${fpd.getDay() + '/' + fpd.getMonth() + '/' + fpd.getFullYear()}`;
    }

    return (
        <div className={"container-item" + (task.finishDate? '' : ' ativo')}>
            <img src={task.finishDate? '/checked.svg' : '/not-checked.svg'} 
                alt={task.finishDate? 'Tarefa concluida' : 'Tarefa em aberto'}/>
            <div>
                <p className={task.finishDate? 'concluido' : ''}>{task.name}</p>
                <span>{getDateText(task.finishDate, task.finishPrevisionDate)}</span>
            </div>
        </div>
    );
}

export { Item }