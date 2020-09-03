export class Question {
    static create(question) {
        return fetch('https://podcast--app-a4d1b.firebaseio.com/questions.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(response => {
                question.id = response.name
                return question
            }).then(addToLocalStorage)
            .then(Question.renderList)
    }

    static fetch(token) {
        if(!token){
            return Promise.resolve('<p class="error">У Вас нет токена</p>')
        }
        return fetch(`https://podcast--app-a4d1b.firebaseio.com/questions.json?auth=${token}`)
        .then(response => response.json())
        .then(response => {
           if(response && response.error) {
               return `<p class="error">${response.error}</p>`
           }
           return response ? Object.keys(response).map(key => ({
               ...response[key],
               id: key
           })) : []
        
        })
    }

    static renderList() {
        const questions = getItemFromLocalStorage()
        const html = questions.length 
        ? questions.map(addHtml).join('') 
        : `<div class="mui--text-headline">Вы пока не задали ни одного вопроса</div>`

        const list = document.getElementById('list');
        list.innerHTML = html
    }

    static listToHtml(questions) {
        return questions.length 
        ? `<ol>${questions.map(q => `<li><small>
        ${new Date(q.date).toLocaleDateString()} 
        ${new Date(q.date).toLocaleTimeString()}
        </small><br><p>${q.text}</p></li>`).join('')}</ol>`
        : `<p>Вопросов пока нет</p>`
    }
}

function addHtml(question) {    
    return `
    <div class="mui--text-black-54">
    ${new Date(question.date).toLocaleDateString()}
    ${new Date(question.date).toLocaleTimeString()}    
    </div>    
    <div class="ttu">${question.text}</div>
    <br>
    `
}

function addToLocalStorage(question) {
    const all = getItemFromLocalStorage()
    all.push(question)
    localStorage.setItem('questions', JSON.stringify(all))
}

function getItemFromLocalStorage() {
    return JSON.parse(localStorage.getItem('questions') || '[]')
}