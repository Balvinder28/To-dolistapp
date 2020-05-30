//Function to populate item after creating
function itemTemplate(item)
{
  
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${item.text}</span>
  <div>
    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>       
</li>`
}



//for heading animation
let textWrapper = document.querySelector('.ml11 .letters')
textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>")
anime.timeline({loop: true})
  .add({
    targets: '.ml11 .line',
    scaleY: [0,1],
    opacity: [0.5,1],
    easing: "easeOutExpo",
    duration: 700
  })
  .add({
    targets: '.ml11 .line',
    translateX: [0, document.querySelector('.ml11 .letters').getBoundingClientRect().width + 10],
    easing: "easeOutExpo",
    duration: 700,
    delay: 100
  }).add({
    targets: '.ml11 .letter',
    opacity: [0,1],
    easing: "easeOutExpo",
    duration: 600,
    offset: '-=775',
    delay: (el, i) => 34 * (i+1)
  }).add({
    targets: '.ml11',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });


  //for bgimage
document.body.style.background = "url('https://cooldigital.photography/wp-content/uploads/2018/01/Forest-trees-sunrise-winterly-morning-Nature-wallpaper-940x627.jpg')";


//Create feature
let createfield=document.getElementById("create-list")
document.getElementById("create-form").addEventListener("submit",function(e){
e.preventDefault()

axios.post('/create', {text: createfield.value}).then(function (response) {
 //create html for new item
 document.getElementById("item-list").insertAdjacentHTML("beforeend",itemTemplate(response.data))
 createfield.value = ""
 createfield.focus()
   
}).catch(function() {
  console.log("Please try again later.")
})
})

//To Listen all events on webpage

document.addEventListener("click",function(e){
   
   //delete feature
   if (e.target.classList.contains("delete-me")) {
if(confirm("Do you really want to delete this item permanently ?"))   

axios.post('/delete', { id: e.target.getAttribute("data-id")}).then(function () {
    e.target.parentElement.parentElement.remove()
  }).catch(function() {
    console.log("Please try again later.")
  })
}



    // update feature
    if (e.target.classList.contains("edit-me")) {
        let userInput = prompt("Enter your desired new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if (userInput) {
          axios.post('/update', {text: userInput, id: e.target.getAttribute("data-id")}).then(function () {
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
          }).catch(function() {
            console.log("Please try again later.")
          })
        }
      }
    })