const data = Array.from({length: 100}).map((_, i)=>{
    return `Item ${i+1}`;
});

let perPage = 5;
const state = {
    page: 1,
    perPage: perPage,
    totalPages: Math.ceil(data.length / perPage),
    maxVisibleButtons: 5
}

const html = {
    get(element){
        return document.querySelector(element);
    }
}

const controls = {
    next(){
        state.page++;
        const lastPage = state.page > state.totalPages;
        if (lastPage){
            state.page--;
        }
    },

    prev(){
        state.page--;
        const firstPage = state.page < 1;

        if (firstPage){
            state.page++;
        }
    },

    goTo(page){
        if (page < 1){
            state.page = 1;
        }

        state.page = +page;

        if (page > state.totalPages){
            state.page = state.totalPages;
        }
    },

    createListeners(){
        html.get(".first").addEventListener("click", ()=>{
            controls.goTo(1);
            update();
        });

        html.get(".last").addEventListener("click", ()=>{
            controls.goTo(state.totalPages);
            update();
        });

        html.get(".next").addEventListener("click", () => {
            this.next();
            update();
        });
        
        html.get(".prev").addEventListener("click", () => {
            this.prev();
            update();
        });
    }
}

const list = {
    create(item){
        const div = document.createElement("div");
        div.classList.add("item");
        div.innerHTML = item;
        html.get(".list").appendChild(div);
    },

    update(){
        html.get(".list").innerHTML = "";
        let page = state.page - 1;
        let start = page * state.perPage;
        let end = start + 5;

        const paginatedItems = data.slice(start, end);

        paginatedItems.forEach(list.create);
    }
}

const buttons = {
    element: html.get(".pagination .numbers"),

    create(page){
        const button = document.createElement("div");
        button.innerHTML = page;
        if (state.page == page){
            button.classList.add("active");
        }
        button.addEventListener("click", (event)=>{
            const page = event.target.innerText;
            controls.goTo(page);
            update();
        });
        buttons.element.appendChild(button);
    },

    update(){
        buttons.element.innerHTML = "";
        const {maxLeft, maxRight} = buttons.calculateMaxVisible();
        for (let page = maxLeft; page <= maxRight; page++){
            buttons.create(page);
        }
    },

    calculateMaxVisible(){
        const {maxVisibleButtons} = state;
        let maxLeft = (state.page - Math.floor(maxVisibleButtons/2));
        let maxRight = (state.page + Math.floor(maxVisibleButtons/2));

        if (maxLeft < 1){
            maxLeft = 1;
            maxRight = maxVisibleButtons;
        }

        if (maxRight > state.totalPages){
            maxLeft = state.totalPages - (maxVisibleButtons - 1);
            maxRight = state.totalPages;

            if (maxLeft < 1) maxLeft = 1;
        }

        return {maxLeft, maxRight};
    }
}

function update(){
    list.update();
    buttons.update();
}

function init(){
    update();
    controls.createListeners();
}

init();