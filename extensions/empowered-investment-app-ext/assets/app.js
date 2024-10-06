const promiseOfSomeDatafr = fetch(`${location.origin}/apps/myappfront/review?shop=${Shopify.shop}`,{
  method:"GET",
  headers:{"Content-Type":"application/json"},
}).then(r=>r.json()).then(data => { console.log('in async');return data;});

document.getElementById('review_data').style.display="none";
document.getElementById('review_data_outer').style.display="none";
let check_slider_itemsr = document.getElementById('my_app_slider');

const refreshdata = async () => {
  let someDatar = await promiseOfSomeDatafr;
  let my_app_sliderr = document.getElementById('my_app_slider');
  let my_app_slider_btnr = document.getElementById('my_app_slider_btn');
  let addnr='animation';
  let countj=0;
  // console.log('in asyncdd'+someDatar.length);
  if(someDatar.length === 0) {
    document.getElementById('review_data_outer').style.display="none";
  }
  if(someDatar.length > 0) {
    document.getElementById('review_data_outer').style.display="block";
  }
  my_app_sliderr.innerHTML='';
for(let j = 0; j < someDatar.length; j++) {
  let objr = someDatar[j];

  my_app_sliderr.innerHTML += `<li class='item ${j==0?addnr:''}'>
  <div class='testimonial'>
    <p>${objr.feedback}</p>
    <p>${objr.name}</p>
    <p>${objr.rating === 'bad'?`★★☆☆☆`:objr.rating === 'good'?`★★★☆☆`:`★★★★★`}</p>
  </div>
  <div class="image"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" viewBox="0 0 460 460" xml:space="preserve">
  <g>
    <path style="fill:#FF7F4F;" d="M230.333,0C103.308,0,0,102.974,0,230c0,98.785,62.479,183.024,150.004,215.598l297.381-291.024   C416.25,64.595,330.94,0,230.333,0z"/>
    <path style="fill:#FF5419;" d="M460,230c0-26.416-4.467-51.784-12.663-75.41l-44.274-44.274l-345.46,201.7l50.785,50.785   l-10.785,30.515l52.366,52.367C174.895,454.935,202.187,460,230.332,460C357.358,460,460,357.026,460,230z"/>
    <polygon style="fill:#71E2F0;" points="403.063,110.317 403.063,312.017 230.332,312.017 200.003,211.167 230.332,110.317  "/>
    <polygon style="fill:#C2FBFF;" points="230.332,110.317 230.332,312.017 178.893,312.017 97.603,393.317 97.603,312.017    57.603,312.017 57.603,110.317  "/>
    <polygon style="fill:#C2FBFF;" points="383.063,130.317 383.063,292.017 230.332,292.017 210.333,211.167 230.332,130.317  "/>
    <rect x="77.603" y="130.317" style="fill:#FFFFFF;" width="152.729" height="161.7"/>
    <polygon style="fill:#E0A300;" points="362.823,202.002 343.073,222.122 347.223,250.002 321.993,237.432 311.993,214.882    321.993,172.332 335.023,197.332  "/>
    <polygon style="fill:#FFC61B;" points="321.993,172.332 321.993,237.432 296.753,250.002 300.913,222.122 281.163,202.002    308.963,197.332  "/>
    <polygon style="fill:#E0A300;" points="271.162,202.002 251.412,222.122 255.562,250.002 230.332,237.432 220.332,214.882    230.332,172.332 243.362,197.332  "/>
    <polygon style="fill:#FFC61B;" points="230.332,172.332 230.332,237.432 205.092,250.002 209.252,222.122 189.502,202.002    217.302,197.332  "/>
    <polygon style="fill:#E0A300;" points="179.503,202.002 159.753,222.122 163.903,250.002 138.673,237.432 128.673,214.882    138.673,172.332 151.703,197.332  "/>
    <polygon style="fill:#FFC61B;" points="138.673,172.332 138.673,237.432 113.433,250.002 117.593,222.122 97.843,202.002    125.643,197.332  "/>
  </g>
  </svg></div>
</li>`;
my_app_slider_btnr.innerHTML += `<button class='btn' data-index='${j}'></button>`;

}

if (check_slider_itemsr.hasChildNodes()) {
document.getElementById('review_data_outer').style.display="block";
document.getElementById('review_data').style.display="block";
document.getElementById('review__loading').style.display="none";
}

const slider = document.querySelector('#my_app_slider');
const items = document.querySelectorAll('.item');
const btns = document.querySelectorAll('.btn');


function reset() {
if(items.length >= 0){
for (let i = 0; i < items.length; i++) {
  btns[i].classList.remove('expand');
  items[i].classList.remove('animation');
} 
}
}

function animate(i) {
if(i >= 0){
btns[i].classList.add('expand');
items[i].classList.add('animation');
}

}

function scrollTo(i) {
slider.style.transform = `translateX(${-i * slider.offsetWidth}px)`;
reset();
animate(i);
}

const activate = (e) => e.target.matches('.btn') && scrollTo(e.target.dataset.index);

const init = () => animate(0);

this.addEventListener('load',init,false);
this.addEventListener('click',activate,false);

};
// add data



const form = document.getElementById("feedback_form");
form.addEventListener("submit", function(event){
    event.preventDefault()
    let formData = new FormData(form);
    let data_for=JSON.stringify([...formData.values()]);
    // var rating = formData.get('rating');
    // var comments = formData.get('comments');
    // var name = formData.get('name');
    // var email = formData.get('email');
    // console.log("on event"+rating+comments+name+email)
    console.log('tag', data_for)
  
    fetch(`${location.origin}/apps/myappfront/review?shop=${Shopify.shop}`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:data_for

    }).then((response) => response.json())
    .then((data) => {console.log(data);refreshdata()})
    .catch((error) => console.log(error))
   event.target.reset();

  });



 