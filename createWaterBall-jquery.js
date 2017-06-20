
(function($){

	function drawSin(xOffset,color1,color2){
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = this.config.cvs_config.width;
		canvas.height = this.config.cvs_config.height;

		ctx.save();
		var points = [];//用于存放绘制Sin曲线的点


        ctx.beginPath();
        ctx.arc(this.config.circle_config.r,this.config.circle_config.r,this.config.circle_config.cR - 5,0,2 * Math.PI);
        ctx.clip();
        ctx.closePath();

		ctx.beginPath();
		//在整个轴长上取点
		var w_sX = this.config.wave_config.sX,
			w_waveWidth = this.config.wave_config.waveWidth,
			w_waveHeight = this.config.wave_config.waveHeight,
			w_axisLength = this.config.wave_config.axisLength,
			c_width = this.config.cvs_config.width,
			c_height = this.config.cvs_config.height;

		for(var x = w_sX;x < w_sX + w_axisLength;x += 20 / w_axisLength) {
			//此处坐标(x,y)的取点，依靠公式 “振幅高*sin(x*振幅宽 + 振幅偏移量)”
			var y = -Math.sin((w_sX + x) * w_waveWidth + xOffset);

			var dY = c_height * (1 - this.config.nowRange / 100 );

			points.push([x, dY + y * w_waveHeight]);
			ctx.lineTo(x, dY + y * w_waveHeight);  
		}
		ctx.lineTo(w_axisLength,c_height);
		ctx.lineTo(w_sX,c_height);
		ctx.lineTo(points[0][0],points[0][1]);

		var gradient = ctx.createLinearGradient(0,c_height,c_width,points[points.length - 1][1]);
		gradient.addColorStop(0,color1);
		gradient.addColorStop(1,color2);

		ctx.fillStyle = gradient;
		ctx.fill();
		ctx.restore();


		if (!this.config.isLoading) {
			ctx.save();
			var size = 0.4 * this.config.circle_config.cR;
			ctx.font = size + 'px Microsoft Yahei';
			ctx.textAlign = 'center';
			ctx.fillStyle = this.config.textColorRange[getIndex.call(this)];
			ctx.fillText(~~this.config.nowRange + '%', this.config.circle_config.r, this.config.circle_config.r + size / 2);
			ctx.restore();

		}
		


		return canvas;
	}

	function drawCircle(){
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = this.config.cvs_config.width;
		canvas.height = this.config.cvs_config.height;
		ctx.lineWidth = this.config.lineWidth;
		ctx.beginPath();
		ctx.strokeStyle = this.config.circle_line_color[getIndex.call(this)];
		ctx.arc(this.config.circle_config.r,this.config.circle_config.r,this.config.circle_config.cR,0,2 * Math.PI);
		ctx.stroke();

		return canvas;
	}

	function getIndex(){
		for (var i = 0,data = this.config.data_range;i < data.length;i++) {
			if (this.config.nowRange < data[i]) {
				return i;
			}
		}
		return data.length - 1;

	}

    var methods = {
        init: function (config) {

        	this.config = {
        		cvs_config:{
        			width:220,
        			height:220
        		},
        		wave_config:{
        			sX:0,
        			sY:220 / 2,
        			waveWidth:0.015,
        			waveHeight:5,
        			axisLength:220,
        			speed:0.09,
        			xOffset:0
        		},
        		circle_config:{
        			r:220 / 2,//圆心
        			cR:220 / 2 - 5//半径
        		},
        		isLoading:false,
        		nowRange:0,
        		targetRange:0,
        		lineWidth:2,//圆圈线条宽度
        		data_range:[60,80,100],//数据临界值范围
        		textColorRange:['#fe5022','#fff','#fff'],//不同临界值文字的颜色范围
        		circle_line_color:['#fe3702','#ffa200','#4ed752'],//不同临界值圆圈线条颜色
        		main_backcolor_range:[['#fe5e21','#f98957'],['#ffb30c','#f7d35a'],['#2ed351','#8ced6c']],//渐变色
        		backcolor_range:[['#f76b3b','#f14f17'],['#f4d672','#ffb50d'],['#43ea83','#12ce55']]
        	};
            var wave_config = {},circle_config = {};
            if (config.cvs_config) {
                wave_config = {
                    sY:config.cvs_config.width / 2,
                    axisLength:config.cvs_config.width
                };
                circle_config = {
                    r:config.cvs_config.width / 2,
                    cR:config.cvs_config.width / 2 - 5
                };
            }

            $.extend(true, this.config,{
                wave_config:wave_config,
                circle_config:circle_config
            },config);

            var canvas = document.createElement('canvas');
            canvas.width = this.config.cvs_config.width;
            canvas.height = this.config.cvs_config.height;
            this.html("").html($(canvas));
            this.canvas = canvas;
            // this.unbind('render');
            methods.render.apply(this);
            return this;
        },
        destroy: function () {
        },
        updateRange:function (newVal) {
        	var that = this;
            this.config.targetRange = 0;
            this.config.nowRange = 0;
            this.config.isLoading = false;
            setTimeout(function () {
                that.config.targetRange = newVal;
            },0);
        },
        render: function () {
            var w_sX = this.config.wave_config.sX,
                xOffset = this.config.wave_config.xOffset,
                bg_color1 = this.config.backcolor_range[getIndex.call(this)][0],
                bg_color2 = this.config.backcolor_range[getIndex.call(this)][1],
                main_bg_color1 = this.config.main_backcolor_range[getIndex.call(this)][0],
                main_bg_color2 = this.config.main_backcolor_range[getIndex.call(this)][1],
                ctx = this.canvas.getContext('2d');

            var cvs1 = drawCircle.call(this);

            if (this.config.nowRange <= this.config.targetRange) {
                var tmp = 1;
                this.config.nowRange += tmp;
            }

            if (this.config.nowRange > this.config.targetRange) {
                var tmp = 1;
                this.config.nowRange -= tmp;
            }
            var cvs2 = drawSin.call(this,xOffset + 40, bg_color1, bg_color2);
            var cvs3 = drawSin.call(this,-40 + xOffset, main_bg_color1, main_bg_color2);
            ctx.clearRect(0,0,this.config.cvs_config.width,this.config.cvs_config.height);
            ctx.drawImage(cvs1, 0, 0);
            ctx.drawImage(cvs2, 0, 0);
            ctx.drawImage(cvs3, 0, 0);

            this.config.wave_config.xOffset += this.config.wave_config.speed;
            requestAnimationFrame(methods.render.bind(this));
        }
    };
	$.fn.createWaterBall = function(method) {
		
		if (methods[method]) {
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		} else if(typeof method === 'object' || !method) {
			return methods.init.apply(this,arguments);
		} else {
			$.error('Method ' + method + 'does not exits on jQuery.createWaterBall');
		}
	};
})(jQuery);