//Remider class
class Reminder{
    constructor(title,due,notifyTime){
        this.title = title
        this.due = due
        this.notifyTime = notifyTime
    }
}

//UI class

class UI{

    //get events from locastorage and display them
    static displayEvents(){
        const events = Storage.getEvents()
        events.forEach((event) => UI.addEventToList(event))
    }

    //add element in DOM tree
    static addEventToList(event){
        const table = document.getElementById('event-list')
        const table_row = document.createElement('tr')
        table_row.innerHTML = `
                            <td>${event.title}</td>
                            <td>${event.due}</td>
                            <td>${event.notifyTime}</td>
                            <td><a href="" class="btn btn-danger btn-sm delete-event">Delete</a></td>
                            <td><a href="" class="btn btn-primary btn-sm update-event">Update</a></td>
                        `
        table.appendChild(table_row);
    }

    //clear form after form submit
    static clearForm(){
        document.getElementById('title').value = '';
        document.getElementById('due-date').value = '';
        document.getElementById('notify-time').value = '';
    }

    static removeEvent(e){
        if(e.classList.contains('delete-vent')){
            e.parentElement.parentElement.remove()
        }
        
    }

    // static updateEvent(e){
    //     document.getElementById("title").value = e.title
    //     document.getElementById("due-date").value = e.due
    //     document.getElementById("notify-time").value = e.notifyTime
    // }

    static showAlert(className,message){
        const div = document.createElement('div')
        div.className  = `alert alert-${className}`;
        div.innerHTML = `${message}`
        const container = document.querySelector('.container')
        const form = document.querySelector('#event-form')
        container.insertBefore(div,form)

        setTimeout(()=>{
            div.remove()
        },2000)
    }
}

//Storage class

class Storage{
    static getEvents(){
        let events = [];
        if(localStorage.getItem('event') === null){
            return events;
        }else{
            events = JSON.parse(localStorage.getItem('event'))
        }
        return events;
    }

    static addEvent(event){
        let events = []
        if(localStorage.getItem('event') !== null){
            events = JSON.parse(localStorage.getItem('event'))
        }
        events.push(event);
        localStorage.setItem('event',JSON.stringify(events));
    }

    static deleteEvent(title){
        let events = [];
        if(localStorage.getItem('event') !== null){
            events = JSON.parse(localStorage.getItem('event'))
        }
        events.forEach((e,index)=>{
            if(e.title == title){
                events.splice(index,1);
            }
        })
        localStorage.setItem('event',JSON.stringify(events))
    }

    static updateEvent(event){
        let events = []
        if(localStorage.getItem('event') !== null){
            events = JSON.parse(localStorage.getItem('event'))
        }
        events.forEach((e,index)=>{
            if(e.title === event.title){
                events[index] = event;
            }
        })
        localStorage.setItem('event',JSON.stringify(events))
    }
}

//getRemiders Event
window.onload = (e)=>{
    UI.displayEvents()
}



//addReminders event
let updateFlag = 0
let updateRow = -1
document.getElementById('event-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const title = document.getElementById('title').value;
    const due = document.getElementById('due-date').value;
    const notify = document.getElementById('notify-time').value;

    if(title === '' || due === '' || notify === ''){
        UI.showAlert("danger","all fields mandatory")
    }else{
        if(updateFlag){
            updateRow.cells[0].innerHTML = title
            updateRow.cells[1].innerHTML = due
            updateRow.cells[2].innerHTML = notify

            updateFlag = 0;
            updateRow = -1
        }else{
            const event = new Reminder(title,due,notify);
            UI.addEventToList(event)
            Storage.addEvent(event)
            UI.clearForm()
            UI.showAlert("success","New Event Added")
        }
        
    }
})

//deleteReminders Event

document.getElementById('event-list').addEventListener('click',(e)=>{
    console.log(e.target);
    if(e.target.classList.contains('delete-event')){
        UI.removeEvent(e.target);
        //e.target gives a tag
        let a = e.target.parentElement // this gives td in which a tag embedded
        let title = a.previousElementSibling.previousElementSibling.previousElementSibling.textContent
        Storage.deleteEvent(title)
    }else if(e.target.classList.contains('update-event')){
        let title = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent
        var event = new Reminder("eat","1-1-1","1")
        let row = e.target.parentElement.parentElement
        updateRow = row
        e.preventDefault()
        document.getElementById('title').value = row.cells[0].innerHTML;
        document.getElementById('due-date').value = row.cells[1].innerHTML;
        document.getElementById('notify-time').value = row.cells[2].innerHTML;
        console.log("hit update");
        updateFlag = 1
        // Storage.updateEvent(event)
        // UI.updateEvent(event)
    }
    
})

//updateRemiders Event



// document.addEventListener('DOMContentLoaded',UI.displayEvents())

