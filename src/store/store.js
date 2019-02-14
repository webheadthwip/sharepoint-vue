/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const hasTerm = (value, term) => value.toString().toLowerCase().includes(term.toString().toLowerCase());
const matchObject = (obj, term) => Object.keys(obj).map(key => hasTerm(obj[key], term)).includes(true);
/* eslint-disable */
export const store = new Vuex.Store({
    state: {
        json : require('../assets/pokemon.json'),
        siteUrl: "https://ojpnet.ojp.usdoj.gov/sites/Smartlogic/danny",
        siteList: "Pokemon Spreadsheet",
        searchterm: '',
        pageNumber: 0,
        perPageCount: 50,
        pokemans: [],
        cleanFields: [
            "Nat",
            "Title",
            "HP",
            "Atk",
            "Def",
            "SpA",
            "SpD",
            "Spe",
            "Type I",
            "Type II",
            "Ability I",
          ],
        dirtyFields: [],
        checkedFields: [
            "Nat",
            "Title",
            "HP",
            "Atk",
            "Def",
            "SpA",
            "SpD",
            "Spe",
            "Type I",
            "Type II",
            "Ability I",
        ],
        camlXml: "<View></View>",
        spList: {},
        pokemonData: {},
        isActive: false,
        searchedPokemon: []
    },
    getters: {
        // searchedPokemon: state => {
        //     return state.pokemans.filter(pokemon => matchObject(pokemon, state.searchterm));
        // },
        paginatedPokemon: state => {
            const start = state.pageNumber * state.perPageCount
            const end = start + state.perPageCount;
            return state.searchedPokemon.slice(start, end);
        },
        computedFields: state => {
            return state.cleanFields.filter(
                field => state.checkedFields.includes(field)
            );
        },
        // paginatedData: state => {
        //     const start = state.pageNumber * state.perPageCount,
        //         end = start + this.perPageCount;
        //     return this.listData.slice(start, end);
        // }
    },
    mutations: {
        setPage: (state, num) => state.pageNumber = num,
        setPokemans: state => {
            state.pokemans = state.json
            state.searchedPokemon = state.pokemans
        },
        closeActive: state => state.isActive = false,
        updateSearchterm (state, searchterm) {
            state.searchterm = searchterm
            state.searchedPokemon = state.pokemans.filter(pokemon => matchObject(pokemon, state.searchterm))
        },
        updateCheckedFields (state, checkedFields) {
            state.checkedFields = checkedFields
        },
        showPokemon: (state, pokemon) => {
            state.isActive = true
            state.pokemonData = pokemon
        },

    },
    actions: {
        //hasTerm: value => value.toString().toLowerCase().includes(state.searchterm.toString().toLowerCase()),
        //matchObject: obj => Object.keys(obj).map(key => this.hasTerm(obj[key], state.searchterm)).includes(true),
        getFieldNames: function() {
            var context = new SP.ClientContext(state.siteUrl);
            var list = context.get_web().get_lists().getByTitle(state.siteList);
            var listFields = list.getView("00000000-0000-0000-0000-000000000000").get_viewFields();
            context.load(listFields);

            context.executeQueryAsync(
                Function.createDelegate(this, function() {
                    var fieldEnumerator = listFields.getEnumerator();
                    while (fieldEnumerator.moveNext()) {
                        let dirtyName = fieldEnumerator.get_current();
                        let cleanName = fieldEnumerator.get_current().replace(/\_(.*?)\_/i, " ");
                        /*
                      default name of the Title field is LinkTitle,
                      but 'LinkTitle' is not a proper field to fetch
                      must get 'Title' explicitly
                  */
                        if (dirtyName == "LinkTitle") {
                            state.cleanFields.push("Title");
                            state.cleanFields.push("Title");
                        } else {
                            state.cleanFields.push(cleanName);
                            state.cleanFields.push(dirtyName);
                        }
                    }
                }),
                Function.createDelegate(this, function() {
                    console.log("Failed to get field names");
                })
            );
        }, //end getFieldNames
        readList: function() {
            return new Promise((resolve, reject) => {
                let context = new SP.ClientContext(state.siteUrl);
                let list = context
                    .get_web()
                    .get_lists()
                    .getByTitle(state.siteList);
                let camlQuery = new SP.CamlQuery();
                camlQuery.set_viewXml(state.camlXml);

                state.spList = list.getItems(camlQuery);
                context.load(state.spList);

                context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        resolve("we read the list!");
                    }),
                    Function.createDelegate(this, function() {
                        var reason = new Error("failed to read list");
                        reject(reason); // reject
                    })
                ); //end executeQueryAsync
            }); //end Promise
        }, //end readList
        cleanList: function() {
            //creates a json object for each pokemon
            var fieldEnumerator = state.spList.getEnumerator();
            while (fieldEnumerator.moveNext()) {
                let pokemonObj = {};
                state.cleanFields.forEach((attr, index) => {
                    //this is where getting 'Title' works instead of 'LinkTitle'
                    //cleans out links and html that might show up in fields
                    /* eslint-disable */
                    let regexHttp = /\wiki\/(.*?)\_\(/;
                    let attribute = fieldEnumerator
                        .get_current()
                        .get_item(`${state.cleanFields[index]}`);
                    if (regexHttp.test(attribute)) {
                        pokemonObj[attr] = regexHttp.exec(attribute)[1] || "Name not available";
                    } else {
                        pokemonObj[attr] =
                            attribute != null
                                ? attribute.toString().replace(/<[^>]*>/g, "")
                                : "n/a";
                    }
                });
                state.pokemans.push(pokemonObj);
            }
        } //end cleanList
    }
});
