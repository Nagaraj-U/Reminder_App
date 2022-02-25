
//Remider class
class Reminder{
    constructor(title,dueDate,dueTime,notifyTime){
        this.title = title
        this.dueDate = dueDate
        this.dueTime = dueTime
        this.notifyTime = notifyTime
        this.Time = this.dueDate + " " + this.dueTime;
    }
    
}

//UI class

class UI{

    //get events from locastorage and display them
    static displayEvents(){
        const events = Storage.getEvents()
        events.sort(sortByLeftTime)
        events.forEach((event) => UI.addEventToList(event))
    }

    static deleteAndSortTable(){
        let parent = document.getElementById('event-list')
        while(parent.firstChild){
            parent.removeChild(parent.firstChild)
        }
        this.displayEvents();
    }

    //add element in DOM tree
    static addEventToList(event){
        const table = document.getElementById('event-list')
        const table_row = document.createElement('tr')
        table_row.innerHTML = `
                            <td>${event.title}</td>
                            <td>${event.dueDate}</td>
                            <td>${event.dueTime}</td>
                            <td>${event.notifyTime}</td>
                            <td><a href="" class="btn btn-danger btn-sm delete-event">Delete</a></td>
                            <td><a href="" class="btn btn-primary btn-sm update-event">Update</a></td>
                            <td><span class="badge badge-pill badge-${displayBadgeColor(displayRemainingStatus(event.dueDate.toString() + " " + event.dueTime.toString()))}">
                            ${displayRemainingStatus(event.dueDate.toString() + " " + event.dueTime.toString())}
                            </span></td>
                           `
                            
        // table_row.appendChild(<td></td>)
        table.appendChild(table_row);
    }

    //clear form after form submit
    static clearForm(){
        document.getElementById('title').value = '';
        document.getElementById('due-date').value = '';
        document.getElementById('due-time').value = '';
        document.getElementById('notify-time').value = '';
    }

    static removeEvent(e){
        if(e.classList.contains('delete-event')){
            e.parentElement.parentElement.remove()
        }
        
    }

    // static updateEvent(e){
    //     document.getElementById("title").value = e.title
    //     document.getElementById("due-date").value = e.due
    //     document.getElementById("notify-time").value = e.notifyTime
    // }

    static showAlert(className,message,interval){
        const div = document.createElement('div')
        div.className  = `alert alert-${className}`;
        div.innerHTML = `${message}`
        const container = document.querySelector('.container')
        const form = document.querySelector('#event-form')
        container.insertBefore(div,form)

        setTimeout(()=>{
            div.remove()
        },interval)
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
        events.sort(sortByLeftTime)
        return events;
    }

    static addEvent(event){
        let events = []
        if(localStorage.getItem('event') !== null){
            events = JSON.parse(localStorage.getItem('event'))
        }
        events.push(event);
        events.sort(sortByLeftTime)
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
        events.sort(sortByLeftTime)
        localStorage.setItem('event',JSON.stringify(events))
    }

    static getEvent(title){
        let events = [];
        if(localStorage.getItem('event') !== null){
            events = JSON.parse(localStorage.getItem('event'))
        }
        events.forEach((e,index)=>{
            console.log(e);
            if(e.title == title){
                return events[index];
            }
        })

    }
}

//getRemiders Event
window.onload = (e)=>{
    UI.displayEvents()
}



//addReminders event
let updateFlag = 0
let updateRow;
let prevTitle = ""
document.getElementById('event-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    const title = document.getElementById('title').value;
    const dueDate = document.getElementById('due-date').value;
    const dueTime = document.getElementById('due-time').value;
    const notify = document.getElementById('notify-time').value;

    if(title === '' || dueDate === '' || dueTime == '' || notify === ''){
        UI.showAlert("danger","all fields mandatory",2000)
    }else{
        if(updateFlag === 1){
            updateRow.cells[0].innerHTML = title
            updateRow.cells[1].innerHTML = dueDate
            updateRow.cells[2].innerHTML = dueTime
            updateRow.cells[3].innerHTML = notify
            Storage.deleteEvent(prevTitle)
            console.log(Storage.getEvents());
            let event = new Reminder(title,dueDate,dueTime,notify)
            Storage.addEvent(event)
            UI.deleteAndSortTable()
            console.log(Storage.getEvents());
            updateFlag = 0;
            updateRow = -1
            prevTitle = ""
        }else{
            const event = new Reminder(title,dueDate,dueTime,notify);
            Storage.addEvent(event)
            UI.deleteAndSortTable()
            UI.clearForm()
            UI.showAlert("success","New Event Added",2000)
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
        let title = a.previousElementSibling.previousElementSibling
                    .previousElementSibling.previousElementSibling.textContent
        Storage.deleteEvent(title)
    }else if(e.target.classList.contains('update-event')){
        
        let title = e.target.parentElement.previousElementSibling
                    .previousElementSibling.previousElementSibling
                    .previousElementSibling.previousElementSibling.textContent
        let row = e.target.parentElement.parentElement
        updateRow = row
        e.preventDefault()
        prevTitle = title

        document.getElementById('title').value = row.cells[0].innerHTML;
        document.getElementById('due-date').value = row.cells[1].innerHTML;
        document.getElementById('due-time').value = row.cells[2].innerHTML;
        document.getElementById('notify-time').value = row.cells[3].innerHTML;

        updateFlag = 1
    }
    
})


//functions managing left time for event and arranging in ascending order
// function sortByLeftTime(a,b){
//     let diff1 = getRemaining(a.dueDate);
//     let diff2 = getRemaining(b.dueDate);
//     if(diff1 < diff2){
//         return -1;
//     }
//     return 1;
// }

//CUSTOM SORTING FUNFTION
function sortByLeftTime(a,b){

    if(a.dueDate == b.dueDate)
        return a.dueTime.localeCompare(b.dueTime)

    return a.dueDate.localeCompare(b.dueDate)
}
function getRemaining (ts) {
    const now = moment();
    const then = moment(ts);
    const diff = then.diff(now);
    console.log(diff);
    let f = moment.utc(diff).format("HH:mm:ss.SSS");
    return diff
  }


function displayRemainingStatus(ts){
    const now = moment();
    const then = moment(ts);
    const diff = then.diff(now);
    if(diff < 0){
        return "event passed"
    }else if(diff > 86400000){
        return "more than a day left"
    }else if(diff < 3600000){
        let f = moment.utc(diff).format("HH:mm:ss.SSS");
        return "less than a hour left";
    }
    else{
        return "more than a hour left"
    }
    
}

function displayBadgeColor(status){
    if(status === "event passed"){
        return "warning"
    }else if(status === "less than a hour left"){
        return "secondary"
    }else if(status === "more than a day left"){
        return "success"
    }
    else{
        return "info"
    }
}

  
//function keeps calling to check wether is there a event that user needs to get notified
  var fun = setInterval(() => {
        let events = Storage.getEvents()
        for(let e of events){
            let t = e.dueDate.toString() + " " + e.dueTime.toString();
            let rem = getRemaining(t) - parseInt(e.notifyTime)*60*1000;
            console.log(rem);
            if(rem < parseInt(40*1000) && rem >= 0){
                UI.showAlert("primary","Upcoming event : "+ e.title+ " at " + e.dueTime,6000)
            }
            
        }
  }, 6000)

