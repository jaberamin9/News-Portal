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

window.onclick = function (element) {
    if (element.target == document.getElementById("full-container")) {
        document.getElementById("full-content").innerHTML = "";
        document.getElementById("full-container").style.visibility = "hidden";
    }
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
                            <h4>${i.author.name ? i.author.name : "Unknown User"}</h4>
                            <p>${i.author.published_date}</p>
                        </div>
                    </div>
                    <i class="fa-regular fa-eye"> <span id="view"> ${i.total_view ? i.total_view : "No View"}</span></i>
                    <div class="ratting" id="ratting-${i._id}">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star-half-stroke"></i>
                        <i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                    </div>
                    <i class="fa-solid fa-arrow-right" id="go-btn" onclick="getNewsDetail('${i._id}')"></i>
                </div>
            </div>
        </div>
    </div>`
        Ratting(i._id, i.rating.number);
    })
}

const getNewsDetail = (news_id) => {
    let url = `https://openapi.programming-hero.com/api/news/${news_id}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => showNewsDetail(data.data[0]));
};

const showNewsDetail = (newsDetail) => {
    document.getElementById("full-container").style.visibility = "visible";
    document.getElementById("full-content").innerHTML = `
    <img src="${newsDetail.image_url}" style="width: 100%">
                <h1>${newsDetail.title} <span id="f-is-trending">Trending</span> <span id="f-is-todays-pick">Todays Pick</span></h1>
                <textarea rows="8">${newsDetail.details}
                </textarea>
                <div class="bottom-content" style="width: 100%;margin-top: 20px">
                    <div class="author">
                        <img src="${newsDetail.author.img}">
                        <div class="txt-author">
                        <h4>${newsDetail.author.name ? newsDetail.author.name : "Unknown User"}</h4>
                        <p style="line-height: 0rem;margin-top: 13px;">${newsDetail.author.published_date}</p>
                        </div>
                    </div>
                    <i class="fa-regular fa-eye"> <span id="view"> ${newsDetail.total_view ? newsDetail.total_view : "No View"}</span></i>
                    <div class="ratting" id="ratting-${newsDetail._id}">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star-half-stroke"></i>
                        <i class="fa-regular fa-star"></i>
                        <i class="fa-regular fa-star"></i>
                    </div>
                </div>
    `;
    if (newsDetail.others_info.is_trending) {
        document.getElementById("f-is-trending").style.display = "inline";
    }
    if (newsDetail.others_info.is_todays_pick) {
        document.getElementById("f-is-todays-pick").style.display = "inline";
    }
    Ratting(newsDetail._id, newsDetail.rating.number);
};

const Ratting = (id, number) => {
    let rat = document.getElementById("ratting-" + id);
    if (number == 0.0) {
        rat.innerHTML = `
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>`
    } else if (number >= 0.1 && number <= 0.5) {
        rat.innerHTML = `
    <i class="fa-solid fa-star-half-stroke"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>`
    } else if (number >= 0.6 && number <= 1.0) {
        rat.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>`
    } else if (number >= 1.1 && number <= 1.5) {
        rat.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star-half-stroke"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>`
    } else if (number >= 1.6 && number <= 2.0) {
        rat.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>`
    } else if (number >= 2.1 && number <= 2.5) {
        rat.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star-half-stroke"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>`
    } else if (number >= 2.6 && number <= 3.0) {
        rat.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-regular fa-star"></i>
    <i class="fa-regular fa-star"></i>`
    } else if (number >= 3.1 && number <= 3.5) {
        rat.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star-half-stroke"></i>
    <i class="fa-regular fa-star"></i>`
    } else if (number >= 3.6 && number <= 4.0) {
        rat.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-regular fa-star"></i>`
    } else if (number >= 4.1 && number <= 4.5) {
        rat.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star-half-stroke"></i>`
    } else if (number >= 4.6 && number <= 5.0) {
        rat.innerHTML = `
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>
    <i class="fa-solid fa-star"></i>`
    }
}


