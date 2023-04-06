let loading = document.getElementById("loading");
let cnt = 1;

document.getElementById("menu-btn").onclick = () => {
    if (cnt % 2 == 0) {
        document.getElementById("categorys").style.display = "none";
    } else {
        document.getElementById("categorys").style.display = "block";
    }
    cnt++;
};


fetch("https://openapi.programming-hero.com/api/news/categories")
    .then(i => i.json())
    .then(data => getCategory(data.data.news_category));

const getCategory = (categorys) => {
    loading.style.display = "none";
    let element = document.getElementById("categorys");
    categorys.forEach(i => {
        element.innerHTML += `<p onclick="getContent('${i.category_id}','${i.category_name}')">${i.category_name}</p>`
    });


};

const getContent = (id, name) => {

    loading.style.display = "flex";

    let allnavigationLink = document.querySelectorAll('.category p');
    allnavigationLink.forEach(link => {
        link.classList.remove('active');
        document.querySelector('.category p[onclick*="getContent(\'' + id + '\',\'' + name + '\')"]').classList.add('active');
    });

    document.getElementById("btn-1").classList.remove('active');
    document.getElementById("btn-2").classList.remove('active');
    document.getElementById("btn-1").onclick = () => {
        loading.style.display = "flex";
        document.getElementById("btn-2").classList.remove('active');
        document.getElementById("btn-1").classList.add('active');
        fetch(`https://openapi.programming-hero.com/api/news/category/${id}`)
            .then(i => i.json())
            .then(data => {
                singelContent(data.data.filter(i => {
                    return i.others_info.is_todays_pick == true;
                }), name);
            });
    };

    document.getElementById("btn-2").onclick = () => {
        loading.style.display = "flex";
        document.getElementById("btn-1").classList.remove('active');
        document.getElementById("btn-2").classList.add('active');
        fetch(`https://openapi.programming-hero.com/api/news/category/${id}`)
            .then(i => i.json())
            .then(data => {
                singelContent(data.data.filter(i => {
                    return i.others_info.is_trending == true;
                }), name);
            });
    };

    document.getElementById("sort").onchange = () => {
        loading.style.display = "flex";
        let val = document.getElementById("sort").value;
        if (val == "ascending") {
            fetch(`https://openapi.programming-hero.com/api/news/category/${id}`)
                .then(i => i.json())
                .then(data => {
                    singelContent(data.data.sort((x, y) => {
                        if (x.title < y.title) {
                            return -1;
                        }
                        if (x.title > y.title) {
                            return 1;
                        }
                        return 0;
                    }), name)
                });
        } else if (val == "descending") {
            fetch(`https://openapi.programming-hero.com/api/news/category/${id}`)
                .then(i => i.json())
                .then(data => {
                    singelContent(data.data.sort((x, y) => {
                        if (x.title < y.title) {
                            return -1;
                        }
                        if (x.title > y.title) {
                            return 1;
                        }
                        return 0;
                    }).reverse(), name);
                });
        } else if (val == "views") {
            fetch(`https://openapi.programming-hero.com/api/news/category/${id}`)
                .then(i => i.json())
                .then(data => {
                    singelContent(data.data.sort((x, y) => {
                        if (x.total_view < y.total_view) {
                            return -1;
                        }
                        if (x.total_view > y.total_view) {
                            return 1;
                        }
                        return 0;
                    }), name);
                });
        } else {
            fetch(`https://openapi.programming-hero.com/api/news/category/${id}`)
                .then(i => i.json())
                .then(data => singelContent(data.data, name));
        }
    };

    fetch(`https://openapi.programming-hero.com/api/news/category/${id}`)
        .then(i => i.json())
        .then(data => singelContent(data.data, name));
}


const singelContent = (data, name) => {
    loading.style.display = "none";

    let alert_box = document.getElementsByClassName("alert-dialog")[0];
    alert_box.style.display = "flex"

    let alert = document.getElementById("alert-txt");
    alert.innerHTML = `${data.length} items found for category ${name}`;

    let element = document.getElementById("container");
    element.innerHTML = "";

    data.forEach(i => {
        element.innerHTML += `<div class="container">
        <div class="content">
            <div class="img-content">
                <img src="${i.thumbnail_url}">
            </div>
            <div class="main-content">
                <h3>${i.title}</h3>
                <p class="con">${i.details}</p>
                <div class="bottom-content">
                    <div class="author">
                        <img src="${i.author.img}">
                        <div class="txt-author">
                            <h4>${i.author.name}</h4>
                            <p>${i.author.published_date}</p>
                        </div>
                    </div>
                    <i class="fa-regular fa-eye"> <span id="view"> ${i.total_view}</span></i>
                    <div class="ratting" id="ratting-${i._id}">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star-half-stroke"></i>
                        <i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                    </div>
                    <i class="fa-solid fa-arrow-right" id="go-btn"></i>
                </div>
            </div>
        </div>
    </div>`

        let rat = document.getElementById("ratting-" + i._id);
        if (i.rating.number == 0.0) {
            rat.innerHTML = `
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>`
        } else if (i.rating.number >= 0.1 && i.rating.number <= 0.5) {
            rat.innerHTML = `
        <i class="fa-solid fa-star-half-stroke"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>`
        } else if (i.rating.number >= 0.6 && i.rating.number <= 1.0) {
            rat.innerHTML = `
        <i class="fa-solid fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>`
        } else if (i.rating.number >= 1.1 && i.rating.number <= 1.5) {
            rat.innerHTML = `
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star-half-stroke"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>`
        } else if (i.rating.number >= 1.6 && i.rating.number <= 2.0) {
            rat.innerHTML = `
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>`
        } else if (i.rating.number >= 2.1 && i.rating.number <= 2.5) {
            rat.innerHTML = `
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star-half-stroke"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>`
        } else if (i.rating.number >= 2.6 && i.rating.number <= 3.0) {
            rat.innerHTML = `
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-regular fa-star"></i>
        <i class="fa-regular fa-star"></i>`
        } else if (i.rating.number >= 3.1 && i.rating.number <= 3.5) {
            rat.innerHTML = `
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star-half-stroke"></i>
        <i class="fa-regular fa-star"></i>`
        } else if (i.rating.number >= 3.6 && i.rating.number <= 4.0) {
            rat.innerHTML = `
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-regular fa-star"></i>`
        } else if (i.rating.number >= 4.1 && i.rating.number <= 4.5) {
            rat.innerHTML = `
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star-half-stroke"></i>`
        } else if (i.rating.number >= 4.6 && i.rating.number <= 5.0) {
            rat.innerHTML = `
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>`
        }
    })
}


