/*!
 * jquery.lightbox.js
 * https://github.com/duncanmcdougall/Responsive-Lightbox
 * Copyright 2013 Duncan McDougall and other contributors; @license Creative Commons Attribution 2.5
 *
 * Options:
 * margin - int - default 50. Minimum margin around the image
 * nav - bool - default true. enable navigation
 * blur - bool - default true. Blur other content when open using css filter
 * minSize - int - default 0. Min window width or height to open lightbox. Below threshold will open image in a new tab.
 *
 */
(function ($) {

    'use strict';

    $.fn.lightbox = function (options) {

        var opts = {
            margin: 200,
            margin2: 100,
            nav: true,
            blur: true,
            minSize: 0
        };

        var plugin = {

            items: [],
            lightbox: null,
            image: null,
            current: null,
            locked: false,
            caption: null,

            init: function (items) {
                plugin.items = items;
				plugin.selector = "lightbox-"+Math.random().toString().replace('.','');


                if (!plugin.lightbox) {
                    $('body').append(
                      '<div id="lightbox" style="display:none;">'+
                      '<a href="#" class="lightbox-close lightbox-button"></a>' +
                      '<a href="#" class="lightbox-btn1 lightbox-button2"></a>' +
                      '<a href="#" class="lightbox-btn2 lightbox-button2"></a>' +
                      '<a href="#" class="lightbox-btn3 lightbox-button2"></a>' +
                      '<a href="#" class="lightbox-btn4 lightbox-button2"></a>' +
                      // '<a href="#" class="lightbox-btn5 lightbox-button2"></a>' +
                      '<div class="lightbox-legend1">All CVD systems</div>' +
                      '<div class="lightbox-legend2">Protanopia</div>' +
                      '<div class="lightbox-legend3">Deuteranopia</div>' +
                      '<div class="lightbox-legend4">Histograms</div>' +
                      // '<div class="lightbox-legend5">3D colors</div>' +
                      '<div class="lightbox-nav">'+
                      '<a href="#" class="lightbox-previous lightbox-button"></a>' +
                      '<a href="#" class="lightbox-next lightbox-button"></a>' +
                      '</div>' +
                      '<div href="#" class="lightbox-caption"><p></p></div>' +
                      '</div>'
                    );

                    plugin.lightbox = $("#lightbox");
                    plugin.caption = $('.lightbox-caption', plugin.lightbox);
                }

                if (plugin.items.length > 1 && opts.nav) {
                    $('.lightbox-nav', plugin.lightbox).show();
                } else {
                    $('.lightbox-nav', plugin.lightbox).hide();
                }

                plugin.bindEvents();

            },

            loadImage: function () {
                if(opts.blur) {
                    $("body").addClass("blurred");
                }
                $("img", plugin.lightbox).remove(); // quando clicchi su X assicurati che non ci sia elemento image
                $("#new_images").remove();
                $("#prot_images").remove();
                $("#deut_images").remove();
                $("#histo_container").remove();
                $("#histo1").remove();
                $("#histo2").remove();
                $("#histo3").remove();
                plugin.lightbox.fadeIn('fast').append('<span class="lightbox-loading"></span>');

                var img = $('<img src="' + $(plugin.current).attr('href') + '" draggable="false">');
                //var img = $('<img src="http://localhost:8000/images/gallery/1.jpeg" draggable="false">');
                //console.log($(plugin.current));

                $(img).load(function () {
                    $('.lightbox-loading').remove();
                    plugin.lightbox.append(img);
                    plugin.image = $("img", plugin.lightbox).hide();
                    plugin.resizeImage();
                    plugin.setCaption();
                });
            },

            setCaption: function () {
                var caption = $(plugin.current).data('caption');
                if(!!caption && caption.length > 0) {
                    plugin.caption.fadeIn();
                    $('p', plugin.caption).text(caption);
                }else{
                    plugin.caption.hide();
                }
            },

            resizeImage: function () {
                var ratio, wHeight, wWidth, iHeight, iWidth;
                wHeight = $(window).height() - opts.margin;
                wWidth = $(window).outerWidth(true) - opts.margin;
                plugin.image.width('').height('');
                iHeight = plugin.image.height();
                iWidth = plugin.image.width();
                if (iWidth > wWidth) {
                    ratio = wWidth / iWidth;
                    iWidth = wWidth;
                    iHeight = Math.round(iHeight * ratio);
                }
                if (iHeight > wHeight) {
                    ratio = wHeight / iHeight;
                    iHeight = wHeight;
                    iWidth = Math.round(iWidth * ratio);
                }

                plugin.image.width(iWidth).height(iHeight).css({
						'top': ($(window).height() - plugin.image.outerHeight()) / 2 + 'px',
						'left': ($(window).width() - plugin.image.outerWidth()) / 2 + 'px'
					}).show();
                plugin.locked = false;
            },

            // plot_3D_fun: function () {
            //   let origin = [480, 300], scale = 20, key = function(d){ return d.id; }, startAngle = Math.PI/4;
            //   //let svg    = d3.select('svg').call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd)).append('g');
            //   let color  = d3.scaleOrdinal(d3.schemeCategory20);
            //
            //   plugin.image.hide()
            //   plugin.lightbox.fadeIn('fast').append('<span class="lightbox-loading"></span>');
            //
            //   let path = plugin.image[0].src;
            //
            //   let arr = path.split("/");
            //   let lastVal = arr.pop();
            //   let filename = lastVal.split('.');
            //   let ext = filename.pop();
            //   let name = filename.pop();
            //   let gallery_path = arr.join("/");
            //
            //   let path_1 = path
            //   let path_2 = gallery_path + '/RecoCVD-D/' + name + '.jpeg'
            //   let path_3 = gallery_path + '/RecoCVD-P/' + name + '.jpeg'
            //
            //   var img1 = $('<img src="' + path_1 + '" draggable="false">')
            //   var img2 = $('<img src="' + path_2 + '" draggable="false">')
            //   var img3 = $('<img src="' + path_3 + '" draggable="false">')
            //
            //   let csv_path_1 = gallery_path + '/NoCVD_tr/' + name + '_tr.csv';
            //   let csv_path_2 = gallery_path + '/CVD-D_tr/' + name + '_tr.csv';
            //   let csv_path_3 = gallery_path + '/CVD-P_tr/' + name + '_tr.csv';
            //
            //   plugin.lightbox.append('<div id="plot3D_1" left=200px top=200px></div>')
            //   plugin.lightbox.append('<div id="plot3D_2" left=400px top=200px></div>')
            //   plugin.lightbox.append('<div id="plot3D_3" left=600px top=200px></div>')
            //
            //   let plot3D_1 = $('#plot3D_1');
            //   let plot3D_2 = $('#plot3D_2');
            //   let plot3D_3 = $('#plot3D_3');
            //
            //   let grid3d = d3._3d()
            //       .shape('GRID', 20)
            //       .origin(origin)
            //       .rotateY( startAngle)
            //       .rotateX(-startAngle)
            //       .scale(scale);
            //   //console.log("grid3d", grid3d)
            //
            //   let point3d = d3._3d()
            //       .x(function(d){ return d.x; })
            //       .y(function(d){ return d.y; })
            //       .z(function(d){ return d.z; })
            //       .origin(origin)
            //       .rotateY( startAngle)
            //       .rotateX(-startAngle)
            //       .scale(scale);
            //
            //   let yScale3d = d3._3d()
            //       .shape('LINE_STRIP')
            //       .origin(origin)
            //       .rotateY( startAngle)
            //       .rotateX(-startAngle)
            //       .scale(scale);
            //
            //   init(csv_path_1, plot3D_1, 1, 0, 0);
            //   init(csv_path_2, plot3D_2, 2, 200, 300);
            //   init(csv_path_3, plot3D_3, 3, 400, 300);
            //
            //   function posPointX(d){
            //       return d.projected.x;
            //   }
            //
            //   function posPointY(d){
            //       return d.projected.y;
            //   }
            //
            //   function init(csv_path, plot_3D, id, lefttransl, toptransl){
            //
            //       let alpha = 0, beta = 0;
            //       let svg;
            //       let mx, my, mouseX, mouseY;
            //       let xGrid = [], scatter = [], yLine = [];
            //
            //       function dragStart(){
            //           mx = d3.event.x;
            //           my = d3.event.y;
            //       }
            //
            //       function dragged(){
            //           mouseX = mouseX || 0;
            //           mouseY = mouseY || 0;
            //           beta   = (d3.event.x - mx + mouseX) * Math.PI / 230 ;
            //           alpha  = (d3.event.y - my + mouseY) * Math.PI / 230  * (-1);
            //           let data = [
            //                grid3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(xGrid),
            //               point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(scatter),
            //               yScale3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([yLine]),
            //           ];
            //           processData(data, 0);
            //       }
            //
            //       function dragEnd(){
            //           mouseX = d3.event.x - mx + mouseX;
            //           mouseY = d3.event.y - my + mouseY;
            //       }
            //
            //       function processData(data, svg, tt){
            //
            //           /* ----------- GRID ----------- */
            //           // console.log("data", data);
            //           // console.log("svg", svg);
            //           svg = d3.select('svg').call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd)).append('g');
            //           let xGrid = svg.selectAll('path.grid').data(data[0], key);
            //
            //           xGrid
            //               .enter()
            //               .append('path')
            //               .attr('class', '_3d grid')
            //               .merge(xGrid)
            //               .attr('stroke', 'black')
            //               .attr('stroke-width', 0.3)
            //               .attr('fill', function(d){ return d.ccw ? 'lightgrey' : '#717171'; })
            //               .attr('fill-opacity', 0.9)
            //               .attr('d', grid3d.draw);
            //
            //           xGrid.exit().remove();
            //
            //           /* ----------- POINTS ----------- */
            //
            //           let points = svg.selectAll('circle').data(data[1], key);
            //
            //           points
            //               .enter()
            //               .append('circle')
            //               .attr('class', '_3d')
            //               .attr('opacity', 0)
            //               .attr('cx', posPointX)
            //               .attr('cy', posPointY)
            //               .merge(points)
            //               .transition().duration(tt)
            //               .attr('r', 3)
            //               .attr('stroke', function(d){ return d3.color(color(d.id)).darker(3); })
            //               .attr('fill', function(d){ return color(d.id); })
            //               .attr('opacity', 1)
            //               .attr('cx', posPointX)
            //               .attr('cy', posPointY);
            //
            //           points.exit().remove();
            //
            //           /* ----------- y-Scale ----------- */
            //
            //           let yScale = svg.selectAll('path.yScale').data(data[2]);
            //
            //           yScale
            //               .enter()
            //               .append('path')
            //               .attr('class', '_3d yScale')
            //               .merge(yScale)
            //               .attr('stroke', 'black')
            //               .attr('stroke-width', .5)
            //               .attr('d', yScale3d.draw);
            //
            //           yScale.exit().remove();
            //
            //            /* ----------- y-Scale Text ----------- */
            //
            //           let yText = svg.selectAll('text.yText').data(data[2][0]);
            //
            //           yText
            //               .enter()
            //               .append('text')
            //               .attr('class', '_3d yText')
            //               .attr('dx', '.3em')
            //               .merge(yText)
            //               .each(function(d){
            //                   d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
            //               })
            //               .attr('x', function(d){ return d.projected.x; })
            //               .attr('y', function(d){ return d.projected.y; })
            //               .text(function(d){ return d[1] <= 0 ? d[1] : ''; });
            //
            //           yText.exit().remove();
            //
            //           d3.selectAll('._3d').sort(d3._3d().sort);
            //       }
            //
            //
            //       if($("#svg_" + id).length){
            //         svg = $("#svg_" + id)
            //       }
            //       else{
            //         svg = $('<svg id="svg_' + id + '" ></svg>');
            //         plot_3D.append(svg);
            //       }
            //
            //       svg.attr("transform", "translate(" + lefttransl + "," + toptransl + ")");
            //
            //       d3.csv(csv_path, function(d) {
            //           // console.log("d", d)
            //           return {x: +d.x, y: +d.y, z: +d.z};
            //         }, function(error, rows) {
            //             console.log("rows", rows);
            //             console.log("error", error);
            //             let d;
            //             for(let i = 0; i < rows.length; i++){
            //                     d = rows[i];
            //                     xGrid.push([d.x, 1, d.z]);
            //                     scatter.push({x: d.x, y: d.y, z: d.z, id: 'point_' + i});
            //                   }
            //
            //             //d3.range(-1, 11, 1).forEach(function(d){ yLine.push([-j, -d, -j]); });
            //             d3.range(0, 255, 1).forEach(function(d){ yLine.push([-255, -d, -255]); });
            //
            //             console.log("xGrid", xGrid)
            //             // console.log("scatter", scatter)
            //             // console.log("yLine", yLine)
            //             let data = [
            //                 grid3d(xGrid),
            //                 point3d(scatter),
            //                 yScale3d([yLine])
            //             ];
            //             processData(data, svg[0], 1000);
            //         })
            //
            //   }
            //
            //
            //
            // },

            plot_3D_fun: function (){

              if($("#images").length){
                return
              }

                plugin.image.hide()
                plugin.lightbox.fadeIn('fast').append('<span class="lightbox-loading"></span>');

                let path = plugin.image[0].src;

                let arr = path.split("/");
                let lastVal = arr.pop();
                let filename = lastVal.split('.');
                let ext = filename.pop();
                let name = filename.pop();
                let gallery_path = arr.join("/");

                let path_1 = path
                let path_2 = gallery_path + '/RecoCVD-D/' + name + '.jpeg'
                let path_3 = gallery_path + '/RecoCVD-P/' + name + '.jpeg'

                var img1 = $('<img src="' + path_1 + '" draggable="false">')
                var img2 = $('<img src="' + path_2 + '" draggable="false">')
                var img3 = $('<img src="' + path_3 + '" draggable="false">')

                let csv_path_1 = gallery_path + '/original_tr/' + name + '_tr.csv';
                let csv_path_2 = gallery_path + '/RecoD_tr/' + name + '_tr.csv';
                let csv_path_3 = gallery_path + '/RecoP_tr/' + name + '_tr.csv';

                plugin.lightbox.append('<div id="images"></div>')
                let img_div = $("#images");

                plugin.lightbox.append('<div id="plot3D_1"></div>')
                plugin.lightbox.append('<div id="plot3D_2"></div>')
                plugin.lightbox.append('<div id="plot3D_3"></div>')

                let plot3D_1 = $('#plot3D_1');
                let plot3D_2 = $('#plot3D_2');
                let plot3D_3 = $('#plot3D_3');

                plugin.lightbox.append('<div id="text_container" ></div>')

                let text_container = $('#text_container');

                text_container.append(' \
                <div class="lightbox-title4"><b>3D Colors</b></div> \
                <div class="lightbox-caption1">Original image</div> \
                <div class="lightbox-caption3">D-Recolored image</div>\
                <div class="lightbox-caption4">P-Recolored image</div>\
                <div class="lightbox-footer7"> \
                <b>(Top row)</b> - D-Recolored is for users affected by Deuteranopia, P-Recolored is for users affected by Protanopia \
                </div> \
                <div class="lightbox-footer8"> \
                <b>(Bottom row)</b> - Color triplets in the RGB space (x = Red, y = Green, z = Blue) \
                </div>');

                let wHeight = $(window).height() - opts.margin;
                let wWidth = $(window).outerWidth(true) - opts.margin;

                $(img1).load(function () {
                    $('.lightbox-loading').remove();
                    img1.hide()

                    let size_img1 = plugin.compute_size($(img1), wHeight, wWidth, 2.7);
                    let imgHeight = size_img1[0]
                    let imgWidth = size_img1[1]

                    img_div.append(img1);

                    img1.width(imgWidth).height(imgHeight).css({
                    'top': opts.margin + 'px',
                    'left': '220px'
                    }).show();

                    plugin.scatterplot3D(csv_path_1, plot3D_1, 1);

                    plot3D_1.css({
                    'position' : 'absolute',
                    'top': 400 + 'px',
                    'left': 210 + 'px'
                    });

                    let leftmargin = wWidth/3 + 150

                    $(img2).load(function () {
                        $('.lightbox-loading').remove();
                        img2.hide()
                        img_div.append(img2);

                        img2.width(imgWidth).height(imgHeight).css({
                        'top': opts.margin + 'px',
                        'left': leftmargin + 'px'
                        }).show();

                        plugin.scatterplot3D(csv_path_2, plot3D_2, 2);

                        plot3D_2.css({
                        'position' : 'absolute',
                        'top': 400 + 'px',
                        'left': 580 + 'px'
                        });

                    }).each(function() {
                      if(this.complete) $(this).trigger('load')});

                    let newleftmargin = wWidth/3 + 515

                    $(img3).load(function () {
                        $('.lightbox-loading').remove();
                        img3.hide()
                        img_div.append(img3);

                        img3.width(imgWidth).height(imgHeight).css({
                        'top': opts.margin + 'px',
                        'left': newleftmargin + 'px'
                        }).show();

                        plugin.scatterplot3D(csv_path_3, plot3D_3, 3);

                        plot3D_3.css({
                        'position' : 'absolute',
                        'top': 400 + 'px',
                        'left': 950 + 'px'
                        });

                    }).each(function() {
                      if(this.complete) $(this).trigger('load')});

                });
            },

            scatterplot3D : function (csv_path, plot3D, id){

                d3.csv(csv_path, function(err, rows){
                  function unpack(rows, key) {
                    return rows.map(function(row)
                    { return row[key]; });}

                let data = [];
                let trace1, color;
                    for(let i = 0; i < rows.length; i++){
                      color = 'rgb(' + rows[i].x + ',' + rows[i].y + ',' + rows[i].z + ')'
                      trace1  = {
                        x:[rows[i].x], y: [rows[i].y], z: [rows[i].z],
                        mode: 'markers',
                        marker: {
                          color: color,
                          size: 3,
                          line: {
                          color: color,
                          width: 0.5},
                          opacity: 0.5},
                        type: 'scatter3d'
                    };
                      data.push(trace1);
                    };

                    let layout = {margin: {
                      l: 0,
                      r: 0,
                      b: 0,
                      t: 0},
                      showlegend: false,
                      autosize: false,
                      width: 316,
                      height: 208,
                    };

                    Plotly.newPlot('plot3D_'+id, data, layout);
                    });

            },


            plot_histo: function () {

              if($("#histo1").length){
                console.log('Sono entrato')
                return
              }

              if($("#histo2").length){
                console.log('Sono entrato')
                return
              }

              if($("#histo3").length){
                console.log('Sono entrato')
                return
              }

              plugin.image.hide()
              plugin.lightbox.fadeIn('fast').append('<span class="lightbox-loading"></span>');

              let path = plugin.image[0].src;

              let arr = path.split("/");
              let lastVal = arr.pop();
              let filename = lastVal.split('.');
              let ext = filename.pop();
              let name = filename.pop();
              let gallery_path = arr.join("/");

              let path_1 = path
              let path_2 = gallery_path + '/RecoCVD-D/' + name + '.jpeg'
              let path_3 = gallery_path + '/RecoCVD-P/' + name + '.jpeg'

              var img1 = $('<img src="' + path_1 + '" draggable="false">')
              var img2 = $('<img src="' + path_2 + '" draggable="false">')
              var img3 = $('<img src="' + path_3 + '" draggable="false">')

              let canvas_1 = $('<canvas id="c1"></canvas');
              let canvas_2 = $('<canvas id="c2"></canvas');
              let canvas_3 = $('<canvas id="c3"></canvas');

              plugin.lightbox.append('<div id="histo1" left=200px top=200px></div>')
              plugin.lightbox.append('<div id="histo2" left=400px top=200px></div>')
              plugin.lightbox.append('<div id="histo3" left=600px top=200px></div>')

              let histo1 = $('#histo1');
              let histo2 = $('#histo2');
              let histo3 = $('#histo3');

              histo1.append(' \
              <button id="red1" class="focuser1">++R</button> \
              <button id="green1" class="focuser2">++G</button> \
              <button id="blue1" class="focuser3">++B</button> \
              <button id="blend1" class="focuser4">Blend</button>'
              );

              histo2.append(' \
              <button id="red2" class="focuser5">++R</button> \
              <button id="green2" class="focuser6">++G</button> \
              <button id="blue2" class="focuser7">++B</button> \
              <button id="blend2" class="focuser8">Blend</button>'
              );

              histo3.append(' \
              <button id="red3" class="focuser9">++R</button> \
              <button id="green3" class="focuser10">++G</button> \
              <button id="blue3" class="focuser11">++B</button> \
              <button id="blend3" class="focuser12">Blend</button>'
              );


              plugin.lightbox.append('<div id="histo_container" ></div>')

              let histo_container = $('#histo_container');

              histo_container.append(' \
              <div class="lightbox-title3"><b>RGB Histograms</b></div> \
              <div class="lightbox-caption1">Original image</div> \
              <div class="lightbox-caption3">D-Recolored image</div>\
              <div class="lightbox-caption4">P-Recolored image</div>\
              <div class="lightbox-footer5"> \
              <b>(Top row)</b> - D-Recolored is for users affected by Deuteranopia, P-Recolored is for users affected by Protanopia \
              </div> \
              <div class="lightbox-footer6"> \
              <b>(Bottom row)</b> - Histograms of the Red, Green, Blue (RGB) channels \
              </div>');



              let wHeight = $(window).height() - opts.margin;
              let wWidth = $(window).outerWidth(true) - opts.margin;

              $(img1).load(function () {
                  $('.lightbox-loading').remove();
                  img1.hide()

                  let size_img1 = plugin.compute_size($(img1), wHeight, wWidth, 2.7);
                  let imgHeight = size_img1[0]
                  let imgWidth = size_img1[1]

                  histo1.append(img1);

                  img1.width(imgWidth).height(imgHeight).css({
                  'top': opts.margin + 'px',
                  'left': '220px'
                  }).show();

                  calc(histo1, canvas_1[0], img1[0], 1, 200, 420)

                  let leftmargin = wWidth/3 + 150

                  $(img2).load(function () {
                      $('.lightbox-loading').remove();
                      img2.hide()
                      histo2.append(img2);

                      img2.width(imgWidth).height(imgHeight).css({
                      'top': opts.margin + 'px',
                      'left': leftmargin + 'px'
                      }).show();

                      calc(histo2, canvas_2[0], img2[0], 2, 570, 208)

                  }).each(function() {
                    if(this.complete) $(this).trigger('load')});

                  let newleftmargin = wWidth/3 + 515

                  $(img3).load(function () {
                      $('.lightbox-loading').remove();
                      img3.hide()
                      histo3.append(img3);

                      img3.width(imgWidth).height(imgHeight).css({
                      'top': opts.margin + 'px',
                      'left': newleftmargin + 'px'
                      }).show();

                      calc(histo3, canvas_3[0], img3[0], 3, 940, -6)

                  }).each(function() {
                    if(this.complete) $(this).trigger('load')});


              });

              function calc(histo, canvas_elem, img_elem, id, lefttransl, toptransl){

                  // TODO: Crea elementi svg (da passare a histogram)

                  let rD={}, gD={}, bD={};
                  //let cv = document.getElementById("C");
                  let ctx = canvas_elem.getContext("2d");

                  canvas_elem.width = img_elem.width;
                  canvas_elem.height = img_elem.height;

                  ctx.drawImage(img_elem, 0, 0);

                  const iD=ctx.getImageData(0, 0, canvas_elem.width,canvas_elem.height).data;

                  for (var i=0; i<256; i++) { rD[i]=0; gD[i]=0; bD[i]=0; }
                  for (var i=0; i<iD.length; i+=4) {
                    rD[iD[i]]++;
                    gD[iD[i+1]]++;
                    bD[iD[i+2]]++;
                  }
                  //console.log(img_elem, rD, gD, bD)

                  let svg;
                  if($("#svg_" + id).length){
                    svg = $("#svg_" + id)
                  }
                  else{
                    svg = $('<svg id="svg_' + id + '" ></svg>');
                    histo.append(svg);
                  }

                  svg.attr("transform", "translate(" + lefttransl + "," + toptransl + ")");

                  histogram({rD, gD, bD}, svg[0]);


              };

              function histogram(data, svg, position) {

                let W=316
                let H=208;

                let activeColor='red';
                let yAxis=false;

                // TODO: Fissare le dimensioni (3 diversi tipi in base a position)
                const margin = {top: 20, right: 20, bottom: 30, left: 50};
                const width = W - margin.left - margin.right;
                const height = H - margin.top - margin.bottom;

                let q = svg;
                q.style.width=W;
                q.style.height=H;
                if (yAxis) { d3.selectAll("g.y-axis").remove(); yAxis=false; }

                function graphComponent(data, color, svg_) {
                  console.log("svg_", svg_)
                  console.log("svg_ id", svg_.id)
                  console.log("svg_id 2", $(svg_).attr('id'))
                  let svg_id = svg_.id;
                  d3.selectAll(".bar-"+ svg_id + '_' + color).remove();
                  data = Object.keys(data).map(function(key){ return {freq:data[key], idx:+key}});
                  let x = d3.scaleLinear()
                    .range([0, width])
                    .domain([0, d3.max(data, function(d) { return d.idx; })]);
                  let y = d3.scaleLinear()
                    .range([height, 0])
                    .domain([0, d3.max(data, function(d) { return d.freq; })]);
                  let svg = d3.select("svg#" + svg_id);

                  let g = svg.append("g")

                  g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                  if (!yAxis) {
                    yAxis=true;
                    g.append("g")
                     .attr("class", "y-axis")
                     .attr("transform", "translate(" + -2 + ",0)")
                     .call(d3.axisLeft(y).ticks(10).tickSizeInner(10).tickSizeOuter(2));
                  }

                  g.selectAll(".bar-"+ svg_id + '_' + color)
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar-"+ svg_id + '_' +color)
                    .attr("fill", color)
                    .attr("x", function(d) { return x(d.idx); })
                    .attr("y", function(d) { return y(d.freq); })
                    .attr("left", "400px")
                    .attr("top", "300px")
                    .attr("width", 2)
                    .attr("opacity", 0.8)
                    .attr("height", function(d) { return height - y(d.freq); })
                }

                graphComponent(data.gD, "green", svg);
                graphComponent(data.bD, "blue", svg);
                graphComponent(data.rD, "red", svg);

            };
        },

            amplify: function(e){
              const t = d3.transition()
                        .duration(750)
                        .ease(d3.easeLinear);
                const colors = ['red', 'green', 'blue'];
                const boost = e.id;
                const num = boost.charAt(boost.length - 1);
                const svg_id = "svg_" + num;
                let svg = d3.select("#" + svg_id);
                if (boost=='blend' + num) {
                   svg.selectAll('rect').transition(t)
                     .style('opacity', 0.7);
                }
                else {
                  let activeColor=boost;
                  let filt = boost.slice(0,-1)
                  let deaden = colors.filter(e=>e!==filt);
                  let bar = $('.bar-' + svg_id + '_' + filt);
                  svg.selectAll('.bar-' + svg_id + '_' + filt).transition(t)
                    .style('opacity' , 1.0);
                  deaden.forEach(color=>{
                  svg.selectAll('.bar-' + svg_id + '_' + color).transition(t)
                    .style('opacity', 0.2);
                  });
                }

            },

            allcvsystem: function () {

                // TODO: change to avoid freezing
                if($("#new_images").length){
                  return
                }

                plugin.image.hide()
                plugin.lightbox.fadeIn('fast').append('<span class="lightbox-loading"></span>');

                let path = plugin.image[0].src

                let arr = path.split("/");
                let lastVal = arr.pop();
                let filename = lastVal.split('.');
                let ext = filename.pop();
                let name = filename.pop();
                let gallery_path = arr.join("/");

                let path_1 = gallery_path + '/NoCVD/' + name + '_comp.jpeg'
                let path_2 = gallery_path + '/CVD-D/' + name + '_comp.jpeg'
                let path_3 = gallery_path + '/CVD-P/' + name + '_comp.jpeg'

                let csv_path_1 = gallery_path + '/NoCVD_tr/' + name + '_tr.csv';
                let csv_path_2 = gallery_path + '/CVD-D_tr/' + name + '_tr.csv';
                let csv_path_3 = gallery_path + '/CVD-P_tr/' + name + '_tr.csv';

                var img1 = $('<img src="' + path_1 + '" draggable="false">')
                var img2 = $('<img src="' + path_2 + '" draggable="false">')
                var img3 = $('<img src="' + path_3 + '" draggable="false">')

                var nocvd = $('<img src="images/noCVD.png" draggable="false">')
                var cvdp = $('<img src="images/CVD-P.png" draggable="false">')
                var cvdd = $('<img src="images/CVD-D.png" draggable="false">')

                plugin.lightbox.append('<div id="new_images" ></div>')
                let new_images = $('#new_images')

                plugin.lightbox.append('<div id="plot3D_1"></div>')
                plugin.lightbox.append('<div id="plot3D_2"></div>')
                plugin.lightbox.append('<div id="plot3D_3"></div>')

                let plot3D_1 = $('#plot3D_1');
                let plot3D_2 = $('#plot3D_2');
                let plot3D_3 = $('#plot3D_3');

                let factor, ratio, wHeight, wWidth, naturalWidth, naturalHeight, iHeight, iWidth;

                wHeight = $(window).height() - opts.margin;
                wWidth = $(window).outerWidth(true) - opts.margin;

                nocvd.on('load', function() {

                    let size_nocvd = plugin.compute_size(nocvd, wHeight, wWidth, 6);
                    let iHeight_nocvd = size_nocvd[0]
                    let iWidth_nocvd = size_nocvd[1]

                    nocvd.width(iWidth_nocvd).height(iHeight_nocvd).css({
                    'position': 'absolute',
                    'top': '95px',
                    'left': '250px'
                    }).show()

                })

                new_images.append(nocvd)

                cvdd.on('load', function() {

                    let size_cvdd = plugin.compute_size(cvdd, wHeight, wWidth, 6);
                    let iHeight_cvdd = size_cvdd[0]
                    let iWidth_cvdd = size_cvdd[1]

                    cvdd.width(iWidth_cvdd).height(iHeight_cvdd).css({
                    'position': 'absolute',
                    'top': '95px',
                    'left': '620px'
                    }).show()

                })

                new_images.append(cvdd)


                cvdp.on('load', function() {

                  let size_cvdp = plugin.compute_size(cvdp, wHeight, wWidth, 6);
                  let iHeight_cvdp = size_cvdp[0]
                  let iWidth_cvdp = size_cvdp[1]

                    cvdp.width(iWidth_cvdp).height(iHeight_cvdp).css({
                    'position': 'absolute',
                    'top': '95px',
                    'left': '990px'
                    }).show()
                })

                new_images.append(cvdp)

                new_images.append('<div class="lightbox-footer1" \
                <p><strong>(Top row)</strong> - Fixation points (white squares) and fixation maps (white areas are the most fixed ones)</p> \
                </div> \
                <div class="lightbox-footer2" \
                <p><strong>(Bottom row)</strong> - Color triplets corresponding to the fixation points in the RGB color space (x = Red, y = Green, z = Blue)</p> \
                </div>')

                $(img1).load(function () {
                    $('.lightbox-loading').remove();
                    img1.hide()


                    let size_img1 = plugin.compute_size($(img1), wHeight, wWidth, 2.7);
                    let imgHeight = size_img1[0]
                    let imgWidth = size_img1[1]

                    new_images.append(img1);

                    img1.width(imgWidth).height(imgHeight).css({
                    'top': opts.margin + 'px',
                    'left': '220px'
                    }).show();

                    plugin.scatterplot3D(csv_path_1, plot3D_1, 1);

                    plot3D_1.css({
                    'position' : 'absolute',
                    'top': 400 + 'px',
                    'left': 210 + 'px'
                    });

                    let leftmargin = wWidth/3 + 150

                    $(img2).load(function () {
                        $('.lightbox-loading').remove();
                        img2.hide()
                        new_images.append(img2);

                        img2.width(imgWidth).height(imgHeight).css({
                        'top': opts.margin + 'px',
                        'left': leftmargin + 'px'
                        }).show();
                    }).each(function() {
                      if(this.complete) $(this).trigger('load')});

                      plugin.scatterplot3D(csv_path_2, plot3D_2, 2);

                      plot3D_2.css({
                      'position' : 'absolute',
                      'top': 400 + 'px',
                      'left': 580 + 'px'
                      });

                    let newleftmargin = wWidth/3 + 515

                    $(img3).load(function () {
                        $('.lightbox-loading').remove();

                        img3.hide()
                        new_images.append(img3);
                        img3.width(imgWidth).height(imgHeight).css({
                        'top': opts.margin + 'px',
                        'left': newleftmargin + 'px'
                        }).show();
                    }).each(function() {
                      if(this.complete) $(this).trigger('load')});

                      plugin.scatterplot3D(csv_path_3, plot3D_3, 3);

                      plot3D_3.css({
                      'position' : 'absolute',
                      'top': 400 + 'px',
                      'left': 950 + 'px'
                      });

                });

            },

            protanopia: function () {

                // TODO: change to avoid freezing
                if($("#prot_images").length){
                  console.log('Sono entrato')
                  return
                }

                plugin.image.hide()
                plugin.lightbox.fadeIn('fast').append('<span class="lightbox-loading"></span>');

                let path = plugin.image[0].src

                let arr = path.split("/");
                let lastVal = arr.pop();
                let filename = lastVal.split('.');
                let ext = filename.pop();
                let name = filename.pop();
                let gallery_path = arr.join("/");

                let path_1 = path
                let path_2 = gallery_path + '/CVD-P/' + name + '_comp.jpeg'
                let path_3 = gallery_path + '/RecoCompCVD-P/' + name + '_comp.jpeg'
                let path_4 = gallery_path + '/RecoCVD-P/' + name + '.jpeg'

                let img1 = $('<img src="' + path_1 + '" draggable="false">')
                let img2 = $('<img src="' + path_2 + '" draggable="false">')
                let img3 = $('<img src="' + path_3 + '" draggable="false">')
                let img4 = $('<img src="' + path_4 + '" draggable="false">')

                let csv_path_1 = gallery_path + '/CVD-P_tr/' + name + '_tr.csv';
                let csv_path_2 = gallery_path + '/RecoCVD-P_tr/' + name + '_tr.csv';

                plugin.lightbox.append('<div id="plot3D_1"></div>')
                plugin.lightbox.append('<div id="plot3D_2"></div>')

                let plot3D_1 = $('#plot3D_1');
                let plot3D_2 = $('#plot3D_2');

                plugin.lightbox.append('<div id="prot_images" ></div>')

                let new_images = $('#prot_images')

                new_images.append(' \
                <div class="lightbox-title1"><b>Protanopia</b></div> \
                <div class="lightbox-text1">Only green and blue receptors in the retina</div> \
                <div class="lightbox-caption1">Original image</div> \
                <div class="lightbox-caption2">Recolored image</div>\
                <div class="lightbox-footer3"> \
                <b>(Center)</b> - Fixation points (white squares) and fixation maps (white areas are the most fixed ones) \
                </div> \
                <div class="lightbox-footer4"> \
                <b>(Right)</b> - Color triplets corresponding to the fixation points in the RGB color space (x = Red, y = Green, z = Blue) \
                </div>')

                let factor, ratio, wHeight, wWidth, naturalWidth, naturalHeight, iHeight, iWidth;

                wHeight = $(window).height() - opts.margin;
                wWidth = $(window).outerWidth(true) - opts.margin;

                let leftmargin = wWidth/3 + 150
                let newleftmargin = wWidth/3 + 515
                let topmargin = wHeight/3 + 240;

                $(img1).load(function () {
                    $('.lightbox-loading').remove();
                    img1.hide()

                    let size_img1 = plugin.compute_size($(img1), wHeight, wWidth, 2.7);
                    let imgHeight = size_img1[0]
                    let imgWidth = size_img1[1]

                    new_images.append(img1);

                    img1.width(imgWidth).height(imgHeight).css({
                    'top': opts.margin + 'px',
                    'left': '220px'
                    }).show();


                    $(img2).load(function () {
                        $('.lightbox-loading').remove();
                        img2.hide()
                        new_images.append(img2);

                        img2.width(imgWidth).height(imgHeight).css({
                        'top': opts.margin + 'px',
                        'left': leftmargin + 'px'
                        }).show();
                    }).each(function() {
                      if(this.complete) $(this).trigger('load')});

                    $(img3).load(function () {
                        $('.lightbox-loading').remove();

                        img3.hide()
                        new_images.append(img3);
                        img3.width(imgWidth).height(imgHeight).css({
                          'top': topmargin + 'px',
                          'left': leftmargin + 'px'
                          }).show();
                    }).each(function() {
                      if(this.complete) $(this).trigger('load')});

                    $(img4).load(function () {
                        $('.lightbox-loading').remove();

                        img4.hide()
                        new_images.append(img4);

                        img4.width(imgWidth).height(imgHeight).css({
                        'top': topmargin + 'px',
                        'left': '220px'
                        }).show();
                    }).each(function() {
                      if(this.complete) $(this).trigger('load')});

                      plugin.scatterplot3D(csv_path_1, plot3D_1, 1);

                      plot3D_1.css({
                      'position' : 'absolute',
                      'top': opts.margin + 'px',
                      'left': newleftmargin + 'px'
                      });

                      plugin.scatterplot3D(csv_path_2, plot3D_2, 2);

                      plot3D_2.css({
                      'position' : 'absolute',
                      'top': topmargin + 'px',
                      'left': newleftmargin + 'px'
                      });

                });

         },

             deuteranopia: function () {

                 // TODO: change to avoid freezing
                 if($("#deut_images").length){
                   console.log('Sono entrato')
                   return
                 }

                 plugin.image.hide()
                 plugin.lightbox.fadeIn('fast').append('<span class="lightbox-loading"></span>');

                 let path = plugin.image[0].src

                 let arr = path.split("/");
                 let lastVal = arr.pop();
                 let filename = lastVal.split('.');
                 let ext = filename.pop();
                 let name = filename.pop();
                 let gallery_path = arr.join("/");

                 let path_1 = path
                 let path_2 = gallery_path + '/CVD-D/' + name + '_comp.jpeg'
                 let path_3 = gallery_path + '/RecoCompCVD-D/' + name + '_comp.jpeg'
                 let path_4 = gallery_path + '/RecoCVD-D/' + name + '.jpeg'

                 var img1 = $('<img src="' + path_1 + '" draggable="false">')
                 var img2 = $('<img src="' + path_2 + '" draggable="false">')
                 var img3 = $('<img src="' + path_3 + '" draggable="false">')
                 var img4 = $('<img src="' + path_4 + '" draggable="false">')

                 let csv_path_1 = gallery_path + '/CVD-D_tr/' + name + '_tr.csv';
                 let csv_path_2 = gallery_path + '/RecoCVD-D_tr/' + name + '_tr.csv';

                 plugin.lightbox.append('<div id="plot3D_1"></div>')
                 plugin.lightbox.append('<div id="plot3D_2"></div>')

                 let plot3D_1 = $('#plot3D_1');
                 let plot3D_2 = $('#plot3D_2');

                 plugin.lightbox.append('<div id="deut_images" ></div>')
                 let new_images = $('#deut_images')

                 new_images.append(' \
                 <div class="lightbox-title2"><b>Deuteranopia</b></div> \
                 <div class="lightbox-text2">Only red and blue receptors in the retina</div> \
                 <div class="lightbox-caption1">Original image</div> \
                 <div class="lightbox-caption2">Recolored image</div>\
                 <div class="lightbox-footer3"> \
                 <b>(Center)</b> - Fixation points (white squares) and fixation maps (white areas are the most fixed ones) \
                 </div> \
                 <div class="lightbox-footer4"> \
                 <b>(Right)</b> - Color triplets corresponding to the fixation points in the RGB color space (x = Red, y = Green, z = Blue) \
                 </div>')

                 let factor, ratio, wHeight, wWidth, naturalWidth, naturalHeight, iHeight, iWidth;

                 wHeight = $(window).height() - opts.margin;
                 wWidth = $(window).outerWidth(true) - opts.margin;

                 $(img1).load(function () {
                     $('.lightbox-loading').remove();
                     img1.hide()

                     let size_img1 = plugin.compute_size($(img1), wHeight, wWidth, 2.7);
                     let imgHeight = size_img1[0]
                     let imgWidth = size_img1[1]

                     new_images.append(img1);

                     img1.width(imgWidth).height(imgHeight).css({
                     'top': opts.margin + 'px',
                     'left': '220px'
                     }).show();

                     let leftmargin = wWidth/3 + 150
                     let newleftmargin = wWidth/3 + 515
                     let topmargin = wHeight/3 + 240;

                     $(img2).load(function () {
                         $('.lightbox-loading').remove();
                         img2.hide()
                         new_images.append(img2);

                         img2.width(imgWidth).height(imgHeight).css({
                         'top': opts.margin + 'px',
                         'left': leftmargin + 'px'
                         }).show();
                     }).each(function() {
                       if(this.complete) $(this).trigger('load')});



                     $(img3).load(function () {
                         $('.lightbox-loading').remove();

                         img3.hide()
                         new_images.append(img3);
                         img3.width(imgWidth).height(imgHeight).css({
                         'top': topmargin + 'px',
                         'left': leftmargin + 'px'
                         }).show();
                     }).each(function() {
                       if(this.complete) $(this).trigger('load')});



                     $(img4).load(function () {
                         $('.lightbox-loading').remove();

                         img4.hide()
                         new_images.append(img4);

                         img4.width(imgWidth).height(imgHeight).css({
                         'top': topmargin + 'px',
                         'left': '220px'
                         }).show();
                     }).each(function() {
                       if(this.complete) $(this).trigger('load')});

                       let labWidth = 300
                       let labHeight = 194

                       plugin.scatterplot3D(csv_path_1, plot3D_1, 1);

                       plot3D_1.css({
                       'position' : 'absolute',
                       'top': opts.margin + 'px',
                       'left': newleftmargin + 'px'
                       });

                       plugin.scatterplot3D(csv_path_2, plot3D_2, 2);

                       plot3D_2.css({
                       'position' : 'absolute',
                       'top': topmargin + 'px',
                       'left': newleftmargin + 'px'
                       });

                 });

          },

             compute_size: function(img_elem, wHeight, wWidth, factor){

                console.log(img_elem)
                 let ih, iw;
                 let nh = img_elem[0].naturalHeight;
                 let nw= img_elem[0].naturalWidth;

                 console.log(nh, nw)
                 if (nw > (wWidth / factor)) {
                     console.log('La larghezza è superiore a wWidth/factor')
                     let ratio = wWidth / (nw * factor);
                     console.log(ratio)
                     iw = wWidth / factor;
                     ih = Math.round(nh * ratio);
                 }
                 else {
                   iw = nw;
                 }
                 if (nh > (wHeight / factor)) {
                     console.log("L'altezza è superiore a wHeight/factor")
                     let ratio = wHeight / (nh * factor);
                     console.log(ratio)
                     ih= wHeight / factor;
                     iw = Math.round(nw * ratio);
                 }
                 else {
                   ih = nh;
                 }
                 console.log(ih, iw)
                 return [ih, iw]
           },

            getCurrentIndex: function () {
                return $.inArray(plugin.current, plugin.items);
            },

            next: function () {
                if (plugin.locked) {
                    return false;
                }
                plugin.locked = true;
                $("#new_images").remove();
                if (plugin.getCurrentIndex() >= plugin.items.length - 1) {
                    $(plugin.items[0]).click();
                } else {
                    $(plugin.items[plugin.getCurrentIndex() + 1]).click();
                }
            },

            previous: function () {
                if (plugin.locked) {
                    return false;
                }
                plugin.locked = true;
                $("#new_images").remove();
                if (plugin.getCurrentIndex() <= 0) {
                    $(plugin.items[plugin.items.length - 1]).click();
                } else {
                    $(plugin.items[plugin.getCurrentIndex() - 1]).click();
                }
            },

            bindEvents: function () {
                $(plugin.items).click(function (e) {
                    if(!$("#lightbox").is(":visible") && ($(window).width() < opts.minSize || $(window).height() < opts.minSize)) {
                        $(this).attr("target", "_blank");
                        return;
                    }
                    var self = $(this)[0];
                    e.preventDefault();
                    plugin.current = self;
                    plugin.loadImage();

                    // Bind Keyboard Shortcuts
                    $(document).on('keydown', function (e) {
                        // Close lightbox with ESC
                        if (e.keyCode === 27) {
                            plugin.close();
                        }
                        // Go to next image pressing the right key
                        if (e.keyCode === 39) {
                            plugin.next();
                        }
                        // Go to previous image pressing the left key
                        if (e.keyCode === 37) {
                            plugin.previous();
                        }
                    });
                });

                // Add click state on overlay background only
                plugin.lightbox.on('click', function (e) {
                    if (this === e.target) {
                        plugin.close();
                    }
                });

                // Previous click
                $(plugin.lightbox).on('click', '.lightbox-previous', function () {
                  $("#new_images").remove();
                  $("#prot_images").remove();
                  $("#deut_images").remove();
                  $("#histo_container").remove();
                  $("#histo1").remove();
                  $("#histo2").remove();
                  $("#histo3").remove();
                  $("#plot3D_1").remove();
                  $("#plot3D_2").remove();
                  $("#plot3D_3").remove();
                  $("#images").remove();
                  $("#text_container").remove();
                    plugin.previous();
                    return false;
                });

                // Next click
                $(plugin.lightbox).on('click', '.lightbox-next', function () {
                  $("#new_images").remove();
                  $("#prot_images").remove();
                  $("#deut_images").remove();
                  $("#histo_container").remove();
                  $("#histo1").remove();
                  $("#histo2").remove();
                  $("#histo3").remove();
                  $("#plot3D_1").remove();
                  $("#plot3D_2").remove();
                  $("#plot3D_3").remove();
                  $("#images").remove();
                  $("#text_container").remove();
                    plugin.next();
                    return false;
                });

                // Close click
                $(plugin.lightbox).on('click', '.lightbox-close', function () {
                  $("#new_images").remove();
                  $("#prot_images").remove();
                  $("#deut_images").remove();
                  $("#histo_container").remove();
                  $("#histo1").remove();
                  $("#histo2").remove();
                  $("#histo3").remove();
                  $("#plot3D_1").remove();
                  $("#plot3D_2").remove();
                  $("#plot3D_3").remove();
                  $("#images").remove();
                  $("#text_container").remove();

                    plugin.close();
                    return false;
                });

                // Button 1
                $(plugin.lightbox).on('click', '.lightbox-btn1', function () {
                    $("#prot_images").remove();
                    $("#deut_images").remove();
                    $("#histo_container").remove();
                    $("#histo1").remove();
                    $("#histo2").remove();
                    $("#histo3").remove();
                    $("#plot3D_1").remove();
                    $("#plot3D_2").remove();
                    $("#plot3D_3").remove();
                    $("#images").remove();
                    $("#text_container").remove();
                    plugin.allcvsystem();
                    return false;
                });

                // Button2
                $(plugin.lightbox).on('click', '.lightbox-btn2', function () {
                    $("#new_images").remove();
                    $("#deut_images").remove();
                    $("#histo_container").remove();
                    $("#histo1").remove();
                    $("#histo2").remove();
                    $("#histo3").remove();
                    $("#plot3D_1").remove();
                    $("#plot3D_2").remove();
                    $("#plot3D_3").remove();
                    $("#images").remove();
                    $("#text_container").remove();
                    plugin.protanopia();
                    return false;
                });

                // Button3
                $(plugin.lightbox).on('click', '.lightbox-btn3', function () {
                    $("#new_images").remove();
                    $("#prot_images").remove();
                    $("#histo_container").remove();
                    $("#histo1").remove();
                    $("#histo2").remove();
                    $("#histo3").remove();
                    $("#plot3D_1").remove();
                    $("#plot3D_2").remove();
                    $("#plot3D_3").remove();
                    $("#images").remove();
                    $("#text_container").remove();
                    plugin.deuteranopia();
                    return false;
                });

                // Button3
                $(plugin.lightbox).on('click', '.lightbox-btn4', function () {
                    $("#prot_images").remove();
                    $("#deut_images").remove();
                    $("#new_images").remove();
                    $("#plot3D_1").remove();
                    $("#plot3D_2").remove();
                    $("#plot3D_3").remove();
                    $("#images").remove();
                    $("#text_container").remove();
                    plugin.plot_histo();
                    return false;
                });

                $(plugin.lightbox).on('click', '.lightbox-btn5', function () {
                    $("#prot_images").remove();
                    $("#deut_images").remove();
                    $("#new_images").remove();
                    $("#histo_container").remove();
                    $("#histo1").remove();
                    $("#histo2").remove();
                    $("#histo3").remove();
                    plugin.plot_3D_fun();
                    return false;
                });

                // ButtonRED1
                $(plugin.lightbox).on('click', '#red1', function () {
                    d3.select(this).classed("bg-yellow", true)
                    d3.select("#green1").classed("bg-yellow", false)
                    d3.select("#blue1").classed("bg-yellow", false)
                    d3.select("#blend1").classed("bg-yellow", false)
                    let foc1 = $('#red1');
                    plugin.amplify(foc1[0]);
                    return false;
                });

                // Button Green1
                $(plugin.lightbox).on('click', '#green1', function () {
                    d3.select(this).classed("bg-yellow", true)
                    d3.select("#red1").classed("bg-yellow", false)
                    d3.select("#blue1").classed("bg-yellow", false)
                    d3.select("#blend1").classed("bg-yellow", false)
                    let foc1 = $('#green1');
                    plugin.amplify(foc1[0]);
                    return false;
                });

                // Button Blue1
                $(plugin.lightbox).on('click', '#blue1', function () {
                    d3.select(this).classed("bg-yellow", true)
                    d3.select("#red1").classed("bg-yellow", false)
                    d3.select("#green1").classed("bg-yellow", false)
                    d3.select("#blend1").classed("bg-yellow", false)
                    let foc = $('#blue1');
                    plugin.amplify(foc[0]);
                    return false;
                });

                // Button Blend1
                $(plugin.lightbox).on('click', '#blend1', function () {
                    d3.select(this).classed("bg-yellow", true)
                    d3.select("#red1").classed("bg-yellow", false)
                    d3.select("#green1").classed("bg-yellow", false)
                    d3.select("#blue1").classed("bg-yellow", false)
                    let foc = $('#blend1');
                    plugin.amplify(foc[0]);
                    return false;
                });

                // Button Red2
                $(plugin.lightbox).on('click', '#red2', function () {
                    d3.select(this).classed("bg-yellow", true)
                    d3.select("#blue2").classed("bg-yellow", false)
                    d3.select("#green2").classed("bg-yellow", false)
                    d3.select("#blend2").classed("bg-yellow", false)
                    let foc = $('#red2');
                    plugin.amplify(foc[0]);
                    return false;
                });

                // Button Green2
                $(plugin.lightbox).on('click', '#green2', function () {
                    d3.select(this).classed("bg-yellow", true)
                    d3.select("#blue2").classed("bg-yellow", false)
                    d3.select("#red2").classed("bg-yellow", false)
                    d3.select("#blend2").classed("bg-yellow", false)
                    let foc = $('#green2');
                    plugin.amplify(foc[0]);
                    return false;
                });

                // Button Blue2
                $(plugin.lightbox).on('click', '#blue2', function () {
                    d3.select(this).classed("bg-yellow", true)
                    d3.select("#red2").classed("bg-yellow", false)
                    d3.select("#green2").classed("bg-yellow", false)
                    d3.select("#blend2").classed("bg-yellow", false)
                    let foc = $('#blue2');
                    plugin.amplify(foc[0]);
                    return false;
                });

                // Button Blend2
                $(plugin.lightbox).on('click', '#blend2', function () {
                    d3.select(this).classed("bg-yellow", true)
                    d3.select("#red2").classed("bg-yellow", false)
                    d3.select("#green2").classed("bg-yellow", false)
                    d3.select("#blue2").classed("bg-yellow", false)
                    let foc = $('#blend2');
                    plugin.amplify(foc[0]);
                    return false;
                });

                // Button Red3
                $(plugin.lightbox).on('click', '#red3', function () {
                    d3.select(this).classed("bg-yellow", true)
                    d3.select("#blue3").classed("bg-yellow", false)
                    d3.select("#green3").classed("bg-yellow", false)
                    d3.select("#blend3").classed("bg-yellow", false)
                    let foc = $('#red3');
                    plugin.amplify(foc[0]);
                    return false;
                });

                // Button Green3
                $(plugin.lightbox).on('click', '#green3', function () {
                    d3.select(this).classed("bg-yellow", true)
                    d3.select("#blue3").classed("bg-yellow", false)
                    d3.select("#red3").classed("bg-yellow", false)
                    d3.select("#blend3").classed("bg-yellow", false)
                    let foc = $('#green3');
                    plugin.amplify(foc[0]);
                    return false;
                });

                // Button Blue3
                $(plugin.lightbox).on('click', '#blue3', function () {
                    d3.select(this).classed("bg-yellow", true)
                    d3.select("#red3").classed("bg-yellow", false)
                    d3.select("#green3").classed("bg-yellow", false)
                    d3.select("#blend3").classed("bg-yellow", false)
                    let foc = $('#blue3');
                    plugin.amplify(foc[0]);
                    return false;
                });

                // Button Blend3
                $(plugin.lightbox).on('click', '#blend3', function () {
                    d3.select(this).classed("bg-yellow", true)
                    d3.select("#red3").classed("bg-yellow", false)
                    d3.select("#green3").classed("bg-yellow", false)
                    d3.select("#blue3").classed("bg-yellow", false)
                    let foc = $('#blend3');
                    plugin.amplify(foc[0]);
                    return false;
                });

                $(window).resize(function () {
                    if (!plugin.image) {
                        return;
                    }
                    plugin.resizeImage();
                });
            },

            close: function () {
                $(document).off('keydown'); // Unbind all key events each time the lightbox is closed
                $(plugin.lightbox).fadeOut('fast');
                $("#new_images").remove();
                $('body').removeClass('blurred');
            }
        };

        $.extend(opts, options);

        plugin.init(this);
    };

})(jQuery);
