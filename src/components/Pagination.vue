<template>
    <nav class="pagination is-centered" role="navigation" aria-label="pagination">
        <a class="pagination-previous" :disabled="-1 >= pageNumber -1" @click="setPage(pageNumber-1)">Previous</a>
        <a class="pagination-next" :disabled="pageNumber == pageCount" @click="setPage(pageNumber+1)">Next page</a>
        <ul class="pagination-list">
            <li><a class="pagination-link" aria-label="Goto page 0">0</a></li>
            <li><span class="pagination-ellipsis">&hellip;</span></li>
            <li><a
                class="pagination-link"
                aria-label="Goto page 45"
                :disabled="0 >= pageNumber -1"
                @click="setPage(pageNumber-2)">{{ pageNumber-2 }}</a>
            </li>
            <li>
                <a
                class="pagination-link"
                aria-label="Goto page 45"
                :disabled="-1 >= pageNumber -1"
                @click="setPage(pageNumber-1)">{{ pageNumber-1 }}</a>
            </li>
            <li><a class="pagination-link is-current" aria-label="Page 46" aria-current="page">{{ pageNumber }}</a></li>
            <li><a
                class="pagination-link"
                aria-label="Goto page 47"
                @click="setPage(pageNumber+1)">{{ pageNumber+1 }}</a>
            </li>
            <li><a
                class="pagination-link"
                aria-label="Goto page 47"
                @click="setPage(pageNumber+2)">{{ pageNumber+2 }}</a>
            </li>
            <li><span class="pagination-ellipsis">&hellip;</span></li>
            <li><a class="pagination-link" aria-label="Goto page 86">{{ pageCount }}</a></li>
        </ul>
    </nav>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
export default {
    name: 'Pagination',
    props: ['resultCount'],
    data: function() {
        return {
            //pageNumber: 1,
        }
    },
    computed: {
        ...mapState([
            'pageNumber',
            'perPageCount',
            'pokemans'
        ]),
        pageCount: function() {
            return Math.ceil(this.resultCount / this.perPageCount)
        },

    },
    methods: {
        ...mapMutations([
            'setPage'
        ]),
    },
}
</script>
