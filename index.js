/*
 API URL: https://itunes.apple.com/search?term=${ARTIST_NAME
}&media=music&entity=album&attribute=artistTerm&limit=200

* 5. Create an Albums List to display the list of albums, including the album name and 
cover.
* 6. Style the page to the best of the ability to make the UI look clean and presentable

*/
//api
const api = (() => {
    const baseUrl ="https://itunes.apple.com/search?term=${"
    const endUrl="}&media=music&entity=album&attribute=artistTerm&limit=200";
    const input = 'ARTIST_NAME';
    
    const getContent = () => fetch([baseUrl,input,endUrl].join(''),{
        body: JSON.stringify(),
    }).then(response => response.json());

    const searchContents = (newSearchs) => fetch([baseUrl,newSearchs,endUrl].join(''),{
        method: "POST",
        body: JSON.stringify(newSearchs),
    }).then((response) => response.json());

    return {
        getContent,
        searchContents,
    };
})();

//view
const view = (() => {
    const domstr = {
        inputsBox: ".search_input",
        searchUl: "#search_result",
    };
    const render = (elem,tmp) =>{
        elem.innerHTML = tmp;
     };

     const createtmp = (arr, rest) => {
        console.log(rest);
        let temp = ""; let lbltemp="";
        lbltemp = ` <span>
                        ${rest}
                    </span>`;
        arr.forEach((element) => {
            temp += `
                <li>
                        <img src= ${element.artworkUrl60}/> 
                        <span> ${element.collectionName}</span>
                </li>
            `;
        });
        return temp;
     };
    return {
        render,
        createtmp,
        domstr,
    };
})();
//model
const model = ((Api,view) => {
    class Search{
        constructor(input){
            this.collectionName = input;
        }
    }
    class State{
        #searchResult = [];

        get searchResult(){
            return this.#searchResult;
        }
        set searchResult(newResult){
            let rest = newResult.resultCount;
            console.log(newResult.resultCount);
            this.#searchResult = [...newResult.results];

            const searchEle = document.querySelector(view.domstr.searchUl);
            console.log(searchEle);

            const tmp = view.createtmp(this.searchResult, rest);
            view.render(searchEle,tmp);
        }
    }

    const getContent = Api.getContent;
    const searchContents = Api.searchContents;

    return{
        getContent,
        searchContents,
        State,
        Search,
    };
})(api,view);
//controller
const controller = ((model,view) => {
    const state = new model.State;

    const seachContent = () => {
        const userInput = document.querySelector(view.domstr.inputsBox);
        userInput.addEventListener("keyup",(event) => {
            if(event.key === 'Enter'){
                const newInput = new model.Search(event.target.value);
                console.log(newInput);

                model.searchContents(newInput).then((elem) =>
                {
                    console.log(elem);
                    state.searchResult = state.searchResult.filter((ele) => ele.collectionName === elem);
                });
                // event.target.value = "";
            }
        });
    };

    const init = () => {
        model.getContent().then((searchResult)=>{
            // console.log(searchResult);
            state.searchResult = searchResult;
        });
    };

    const bootstrap = () => {
        init();
        seachContent();
    };
    return {
        bootstrap
    };
})(model,view);

controller.bootstrap();