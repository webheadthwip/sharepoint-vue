<template>
  <div id="app" class="container is-widescreen">
    <div class="flex flex--center" v-if="loading">
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div v-else>
      <input class="input is-large" type="text" placeholder="Search" v-model="searchterm">
      <div class="flex">
        <div class="flex--item" v-for="field in cleanFields" :key="field.id">
          <input type="checkbox" :name="field" :value="field" v-model="checkedFields">
          <label :for="field">{{ field }}</label>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th v-for="header in computedFields" :key="header.id">{{ header }}</th>
          </tr>
        </thead>
        <tfoot></tfoot>
        <tbody>
          <tr v-for="pokemon in paginatedPokemon" :key="pokemon.id" @click="showPokemon(pokemon)">
            <th
              v-for="(attribute, key) in pokemon"
              v-if="computedFields.includes(key)"
              :key="attribute.id"
              v-html="attribute"
            ></th>
          </tr>
        </tbody>
      </table>
      <pagination :resultCount="pokemans.length"></pagination>
      <hello-world :active="isActive" :pokemon="pokemonData" @close="closeActive"></hello-world>
    </div>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Pagination from './components/Pagination';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  name: "app",
  components: {
    HelloWorld,
    Pagination
  },
  data: function() {
    return {
      loading: true,
    };
  },
  computed: {
    ...mapGetters([
        'computedFields',
        'paginatedPokemon'
    ]),
    ...mapState([
        'json',
        'siteUrl',
        'siteList',
        'searchterm',
        'pageNumber',
        'perPageCount',
        'pokemans',
        'cleanFields',
        'dirtyFields',
        'checkedFields',
        'camlXml',
        'spList',
        'pokemonData',
        'isActive',
    ]),
    searchterm: {
        get () {
            return this.$store.state.searchterm
        },
        set (value) {
            this.$store.commit('updateSearchterm', value)
        }
    },
    checkedFields: {
        get () {
            return this.$store.state.checkedFields
        },
        set (value) {
            this.$store.commit('updateCheckedFields', value)
        }
    }

  },
  methods: {
    ...mapMutations([
        'setPokemans',
        'closeActive',
        'showPokemon',
        'updateSearchterm',
        'updateCheckedFields'
    ]),
    ...mapActions([
        'hasTerm',
        'matchObject',
        'getFieldNames',
        'readList',
        'cleanList',
    ]),

  }, //end methods
  mounted: function() {

    if (typeof SP !== 'undefined'){
      this.getFieldNames();
      this.readList()
        .then(fulfilled => {
            /* eslint-disable */
          console.log(fulfilled + " fulfilled");
          this.cleanList();
          this.loading = false;
        })
        .catch(function(error) {
            /* eslint-disable */
          console.log(error.message);
        });
    } else {
          this.setPokemans();
          this.loading = false;
    }

  }
};
</script>

<style lang="scss">
$modal-content-width: 800px;
@import "../node_modules/bulma/bulma.sass";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-ellipsis div {
  position: absolute;
  top: 27px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #0cc133;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 6px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 6px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 26px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 45px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(19px, 0);
  }
}
.table {
  display: block;
  max-width: 100%;
  overflow-x: auto;
}
.tr {
  font-size: 8px;
}
.flex {
  display: flex;
  flex-wrap: wrap;
  &--center {
    justify-content: center;
    align-items: center;
  }
  &--item {
    flex-basis: 20%;
    text-align: left;
    margin: 5px 0;
    display: flex;
    align-items: center;
  }
  label {
    margin-left: 5px;
  }
}
.table th {
  border: 0;
}
.table tbody tr {
  background-color: #fff;
  border-bottom: 1px solid #dbdbdb;
  transform: translate3d(0, 0, 0);
  transition: box-shadow 0.2s, border-bottom 0.2s, transform 0.2s;

  &:hover,
  &:focus,
  &:active {
    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15), 0 0 15px rgba(0, 0, 0, 0.12);
    border-bottom: 0;
    transform: translateY(-4px);
    cursor: pointer;
  }
}
</style>
