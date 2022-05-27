<script>
    export let method = 'failed';
    export let name1 = 'name1';
    export let ID1 = -1;
    export let name2 = 'name2';
    export let ID2 = -1;
    export let result = -1;
    export let depth = 0;
</script>

<tr>
    <td>{name1}</td>
    <td>[{ID1}]</td>
    <td>{name2}</td>
    <td>[{ID2}]</td>
    <td class="center">{result}</td>
    <td class="center">{method}</td>
    <td class="center">{depth}</td>
</tr>

<style lang="scss">
    td {
        padding: 0px 5px;
    }
    .center {
        text-align: center;
    }
tr:hover {
    background-color: aqua;
}
</style>
