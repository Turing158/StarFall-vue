<template>
    <div class="minSearch">
        <form action="/topic/search" method="get">
            <div>
                <input type="text" name="search"><button type="submit"></button>
            </div>
        </form>
    </div>
</template>
<style scoped>
.minSearch{
    position: absolute;
    left: 0;
    width: 200px;
    height: 55px;
    display: flex;
    align-items: center;
    
}
.minSearch form{
    border: 0;
    display: inline-block;
    line-height: 0;
    height: 30px;
    text-align: left;
}
.minSearch div{
    position: relative;
    left: 2vw;
    width: 180px;
    height: 30px;
    border: 1px solid #111111;
    overflow: hidden;
    border-radius: 5px;
    transition: all 250ms;
}
.minSearch div input{
    width: 150px;
    height: 30px;
    border: none;
    outline: none;
    padding-left: 10px;
    font-size: 15px;
}
.minSearch div:hover{
    border: 1px solid #00862d;
}
.minSearch div button{
    position: absolute;
    left: 150px;
    right: 0;
    width: 30px;
    height: 30px;
    border: none;
    outline: none;
    background-color: #bbbbbb;
    background-image: url(../assets/img/search0.png);
    background-size: 80%;
    background-repeat: no-repeat;
    background-position: 50%;
    cursor: pointer;
    transition: all 250ms;
}
.minSearch div button:hover{
    background-color: #131313;
    background-image: url(../assets/img/search1.png);
}
</style>