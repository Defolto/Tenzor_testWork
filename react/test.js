class App extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            history: [[`Первый заголовок`, `Текст для заголовка 1`],
                    [`Второй заголовок`, `Текст для заголовка 2`]],
            letter: 0,
            notes: [[`Первый заголовок`, `Текст для заголовка 1`],
                    [`Второй заголовок`, `Текст для заголовка 2`]],
            activeNote: [`Первый заголовок`, `Текст для заголовка 1`],
            reverse: false,
            numberNote: 0
        }
    }

    selectNote(i){
        this.setState({
            activeNote: this.state.notes[i],
            numberNote: i
        })
        if (document.querySelector(`.item_active`) == null) {
            document.querySelector(`.item:nth-child(${i+1})`).classList.add('item_active');
        }else{
            document.querySelector(`.item_active`).classList.remove('item_active');
            document.querySelector(`.item:nth-child(${i+1})`).classList.add('item_active');    
        }
    }

    addNote(){
        const title = prompt('Название заметки:');
        const description = prompt('Описание заметки');
        const newNotes = this.state.notes.slice();

        newNotes.push([title,description]);
        this.setState({
            notes: newNotes,
            history: newNotes
        }) 
    }

    serachNotes(e){
        let search = e.target.value;
        let len = search.length;
        let newNotes = [];
        if(len>this.state.letter){
            for (let x = 0; x < this.state.notes.length; x++) {
                if ((search.slice(0,len) == this.state.notes[x][0].slice(0,len)) || (search[0].toUpperCase() + search.slice(1, len) == this.state.notes[x][0].slice(0,len))) {
                    newNotes.push(this.state.notes[x])
                }
            }
        }else{
            for (let i = 0; i < this.state.history.length; i++) {
                if (search.slice(0,len) == this.state.history[i][0].slice(0,len) || (search[0].toUpperCase() + search.slice(1, len) == this.state.history[i][0].slice(0,len))) {
                    newNotes.push(this.state.history[i])
                }
            }
        }
        this.setState({
            notes: newNotes,
            letter: len,
            activeNote: newNotes[0]
        })
        document.querySelector(`.item_active`).classList.remove('item_active');
        document.querySelector(`.item`).classList.add('item_active');
    }

    reverseNotes(e){
        let flag = e.target.value;

        if (flag == this.state.reverse) {
            return
        }else{
            this.setState({
                reverse: !this.state.reverse,
                notes: this.state.notes.reverse(),
                activeNote: this.state.notes[0],
                numberNote: 0
            })
        }
    }

    delete(i){
        let newSpisok = this.state.notes.slice(); 
        newSpisok.splice(i,1);
        let newHistory = this.state.history.slice(); 
        newHistory.splice(i,1)
        let newNumber = i
        if (i==newSpisok.length) {
            newNumber--;
            this.setState({
                numberNote: newNumber
            })
        }
        this.setState({
            history: newHistory,
            notes: newSpisok,
            activeNote: newSpisok[newNumber]
        }) 
        const spisok = document.querySelectorAll(`.item`);
        let flag = false;
        spisok.forEach((element)=>{
            if (element == 'item item_active'){
                flag = !flag;
            }
        })

        if (flag) {
            document.querySelector(`.item_active`).classList.remove('item_active');
            document.querySelector(`.item:nth-child(${newNumber+1})`).classList.add('item_active');
        }
    }

    edit = (title, description) => {
        const newActive = [title, description];

        const newHistory = this.state.history.slice()
        newHistory[this.state.numberNote].splice(0,2, title, description)

        const newNotes = this.state.notes.slice()
        newNotes[this.state.numberNote].splice(0,2, title, description)
        
        this.setState({
            activeNote: newActive,
            history: newHistory,
            notes: newNotes
        })
    }

    render(){
        const spisokItems = this.state.notes.map((element, index) =>{
            if (index == this.state.numberNote) {
                return(
                    <li key={index} className='item item_active' onClick={()=>this.selectNote(index)}>
                        <h4>{element[0]}</h4>
                        <p>{element[1]}</p>
                    </li>
                )
            }else{
                return(
                    <li key={index} className='item' onClick={()=>this.selectNote(index)}>
                        <h4>{element[0]}</h4>
                        <p>{element[1]}</p>
                    </li>
                )
            }
        }
        )

        return(
            <div className='row'>
                <div className='column'>
                    <button className='column__btn' onClick={()=>this.addNote()}>+ Заметка</button>
                    <input className='search' type="text" onChange={this.serachNotes.bind(this)} placeholder='Поиск...'/>
                    <div className='row sort'>
                        <p className='m0'>Сортировать по</p>
                        <select onChange={this.reverseNotes.bind(this)}>
                            <option value="false">убыванию даты</option>
                            <option value="true">возрастанию даты</option>
                        </select>
                    </div>
                    <ul className='spisok'>
                        {spisokItems}
                    </ul>
                </div>
                <MainNote note={this.state.activeNote} 
                          delet={()=>this.delete(this.state.numberNote)}
                          edit={this.edit}/>
            </div>
        )
    }
}

class MainNote extends React.Component{
    constructor(props){
        super(props),
        this.state = {
            edit: false
        }
    }

    saveEdit(title, description){
        this.setState({
            edit: !this.state.edit
        })
        
        this.props.edit(title, description)
    }

    render(){
        if (this.props.note) {
            if (!this.state.edit) {
                return(
                    <div className='column'>
                        <div className='row'>
                            <button className='column__btn column__btn_w50' onClick={()=>this.setState({edit: !this.state.edit})}>Редактировать</button>
                            <button className='column__btn column__btn_w50' onClick={()=>this.props.delet()}>Удалить</button>
                        </div>
                        <div className='note'>
                            <h2>{this.props.note[0]}</h2>
                            <p>{this.props.note[1]}</p>
                        </div>
                    </div>
                )
            }else{
                return(
                    <div className='column'>
                        <div className='row'>
                            <button className='column__btn column__btn_w50' onClick={()=>this.setState({edit: !this.state.edit})}>Редактировать</button>
                            <button className='column__btn column__btn_w50' onClick={()=>this.props.delet()}>Удалить</button>
                        </div>
                        <div className='note'>
                            <textarea id='title'>{this.props.note[0]}</textarea>
                            <textarea id='desription'>{this.props.note[1]}</textarea>
                            <button className='save' onClick={()=>this.saveEdit(document.getElementById("title").value, document.getElementById("desription").value)}>Сохранить</button>
                        </div>
                    </div>
                )
            }
        }else{
            return <div>Заметок не обнаружено</div>
        }
    }
}

ReactDOM.render(<App/>, document.querySelector(`#app`))
document.querySelector(`.item`).classList.add('item_active');
// alert("В данной версии запрещено удалять заметки, когда вы используете 'поиск'")


