/**
 *
 * Created by nobu on 2015/06/14.
 */


var w = 500;
var h = 500;
var padding = 20;
var low = -5;
var high = 5;
var xScale = d3.scale.linear().domain([low, high]).range([padding, w - padding]);
var yScale = d3.scale.linear().domain([low, high]).range([padding, h - padding]);
var svg = d3.select('body')
    .append('svg')
    .attr({
        width: w,
        height: h
    });
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");
var timerId;

svg.append('g')
    .attr({
        class: "axis",
        transform: "translate(0, 250)"
    })
    .call(xAxis);
svg.append('g')
    .attr({
        class: "axis",
        transform: "translate(250, 0)"
    })
    .call(yAxis);

svg.append('g')
    .attr({
        id: "population"
    });
svg.append('g')
    .attr({
        id: "parents"
    });
svg.append('g')
    .attr({
        id: "children"
    });

var state = 0;
$(function() {
    $('#start_btn').click(function() {
        init();
        state = 1;
        timer();
    });
});

var timer = function() {
    timerId = setTimeout(function(){
        if (state == 0) {
            survival_selection();
            state = 1;
        } else if (state == 1) {
            select_parent();
            state = 2;
        } else if (state == 2) {
            make_offspring();
            state = 0;
        }
        timer()
    }, 300);
};

$(function() {
    $('#stop_btn').click(function() {
        stop();
    });
});

var stop = function() {
    clearTimeout(timerId);
};


$(function() {
    $('#next_btn').click(function() {
        if (state == 0) {
            survival_selection();
            state = 1;
        } else if (state == 1) {
            select_parent();
            state = 2;
        } else if (state == 2) {
            make_offspring();
            state = 0;
        }
    })
});

/**
 * 親個体選択
 */
var select_parent = function() {
    var npar = parseInt($('#npar').val());
    $.ajax({
        type: 'POST',
        url: '/parents',
        data: JSON.stringify({'npar': npar}),
        contentType: 'application/json',
        dataType: 'json',
        success: function(json) {
            var dataset = json['parents'];
            var circle = svg.select('#parents').selectAll('circle');
            var update = circle.data(dataset);
            var enter = update.enter();
            update.attr({
                cx: function(d) { return xScale(d[0]) },
                cy: function(d) { return yScale(d[1]) },
                r: 5,
                fill: 'green'
            });
            enter.append('circle').attr({
                cx: function(d) { return xScale(d[0]) },
                cy: function(d) { return yScale(d[1]) },
                r: 5,
                fill: 'green'
            });
        }
    });
};

/**
 * 子個体生成
 */
var make_offspring = function() {
    var nchi = parseInt($('#nchi').val());
    $.ajax({
        type: 'POST',
        url: '/children',
        data: JSON.stringify({'nchi': nchi * 2}),
        contentType: 'application/json',
        dataType: 'json',
        success: function(json) {
            var dataset = json['children'];
            var circle = svg.select('#children').selectAll('circle');
            var update = circle.data(dataset);
            var enter = update.enter();
            update.attr({
                cx: function(d) { return xScale(d[0]) },
                cy: function(d) { return yScale(d[1]) },
                r: 5,
                fill: 'blue'
            });
            enter.append('circle').attr({
                cx: function(d) { return xScale(d[0]) },
                cy: function(d) { return yScale(d[1]) },
                r: 5,
                fill: 'blue'
            });
        }
    });
};

/**
 * 生存選択
 */
var survival_selection = function() {
    var npar = parseInt($('#npar').val());
    $.ajax({
        type: 'POST',
        url: '/survival',
        data: JSON.stringify({'npar': npar}),
        contentType: 'application/json',
        dataType: 'json',
        success: function(json) {
            var dataset = json['population'];
            svg.select('#parents').selectAll('circle').remove();
            svg.select('#children').selectAll('circle').remove();
            var circle = svg.select('#population').selectAll('circle');
            var update = circle.data(dataset);
            var enter = update.enter();
            update.attr({
                cx: function(d) { return xScale(d[0]) },
                cy: function(d) { return yScale(d[1]) },
                r: 5,
                fill: 'red'
            });
            enter.append('circle').attr({
                cx: function(d) { return xScale(d[0]) },
                cy: function(d) { return yScale(d[1]) },
                r: 5,
                fill: 'red'
            });
            var bestValue = json['bestvalue'];
            var bestSol = json['bestsol'];
            $('#best').html("f(x) = " + bestValue + ", x = [ " + bestSol.toString() + " ]");
            if (bestValue < 1e-7) stop();
        }
    });
};

var init = function() {
    var npop = parseInt($('#npop').val());
    $.ajax({
        type: 'POST',
        url: '/init',
        data: JSON.stringify({'npop': npop * 2}),
        contentType: 'application/json',
        dataType: 'json',
        success: function(json) {
            var dataset = json['population'];
            svg.select('#parents').selectAll('circle').remove();
            svg.select('#children').selectAll('circle').remove();
            var circle = svg.select('#population').selectAll('circle');
            var update = circle.data(dataset);
            var enter = update.enter();
            update.attr({
                cx: function(d) { return xScale(d[0]) },
                cy: function(d) { return yScale(d[1]) },
                r: 5,
                fill: 'red'
            });
            enter.append('circle').attr({
                cx: function(d) { return xScale(d[0]) },
                cy: function(d) { return yScale(d[1]) },
                r: 5,
                fill: 'red'
            });
            var bestValue = json['bestvalue'];
            $('#best').html("f(x) = " + bestValue);
        }
    });
};
