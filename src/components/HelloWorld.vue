<template>
  <div id="bigModal" class="modal is-active" v-if="active">
    <div class="modal-background"></div>
    <div class="modal-content">
      <!-- Any other Bulma elements you want -->
      <div class="box">
      <article class="media">
        <div class="media-left">
          <figure class="image">
            <img :src="imgUrl" alt="Image">
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
              <h2>{{ pokemon.Title }}</h2>
              <br>
              <div class="chart-container" style="position: relative; margin: 0 auto; height:200px; width:400px">
                <canvas id="myChart" ref="myChart"></canvas>
              </div>
              <p>pokemon type: {{ pokemon['Type I']}}</p>
              <p>color:{{ element[pokemon['Type I']] }}</p>
          </div>
        </div>
      </article>
    </div>
    </div>
    <div @click="dismiss" class="modal-close is-large" aria-label="close"></div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: ["active", "pokemon"],
  created() {
    const escapeHandler = e => {
      if (e.key === "Escape" && this.show) {
        this.dismiss();
      }
    };

    document.addEventListener("keydown", escapeHandler);
    this.$once("hook:destroyed", () => {
      document.removeEventListener("keydown", escapeHandler);
    });

  },
  watch: {
    pokemon: function() {
      this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
        const ctx = document.getElementById('myChart').getContext('2d');
        let chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'radar',

            // The data for our dataset
            data: {
                labels: ['HP', 'Atk', 'Def', 'Special Atk', 'Special Defense', 'Speed'],
                datasets: [{
                    label: 'Stats',
                    data: [this.pokemon.HP, this.pokemon.Atk, this.pokemon.Def, this.pokemon.SpA, this.pokemon.SpD, this.pokemon.Spe,],
                    backgroundColor: this.element[this.pokemon['Type I']],
                    pointBackgroundColor: '#363636'
                }]
            },

            // Configuration options go here
            options: {}
        });
      })
    }
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      pkmnNum: '',
      element: {
        Normal: '#A8A77A',
        Fire:  '#EE8130',
        Water:  '#6390F0',
        Electric:  '#F7D02C',
        Grass:  '#7AC74C',
        Ice:  '#96D9D6',
        Fighting:  '#C22E28',
        Poison:  '#A33EA1',
        Ground:  '#E2BF65',
        Flying:  '#A98FF3',
        Psychic:  '#F95587',
        Bug:  '#A6B91A',
        Rock:  '#B6A136',
        Ghost:  '#735797',
        Dragon:  '#6F35FC',
        Dark:  '#705746',
        Steel:  '#B7B7CE',
        Fairy:  '#D685AD'
      },
    };
  },
  computed: {
    imgUrl: function () {
      (this.pokemon.Nat.length >= 3) ? this.pkmnNum = this.pokemon.Nat : this.pkmnNum = (new Array(3).join(0) + this.pokemon.Nat).slice(-3);
        return `https://ojpnet.ojp.usdoj.gov/sites/Smartlogic/danny/Pokemon%20Images/${this.pkmnNum}.png`
    },
  },
  methods: {
    dismiss() {
      this.$emit("close");
    },
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered even if v-if is false
      //console.table(this.pokemon);

    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
