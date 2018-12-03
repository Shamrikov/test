;(function($){

	"use strict";

	var Core = {

		DOMReady: function(){

			var self = this;
			
			self.backToTopBtn({
			    transitionIn: 'bounceInRight',
			    transitionOut: 'bounceOutRight'
			});

			self.headerSticky.init();
			self.mobMenu();
			self.itemBox.init();
			self.progressBar();
		},

		windowLoad: function(){

			var self = this;

			
		},

		/**
		**	Back to top
		**/

		backToTopBtn: function(config){

			config = $.extend({
				offset: 350,
				transitionIn: 'bounceInRight',
				transitionOut: 'bounceOutRight'
			}, config);

			var btn = $('<button></button>', {
				class: 'back_to_top animated hide',
				html: '<i class="fa fa-angle-up"></i>'
			}).appendTo($('body')),

			$wd = $(window),
			$html = $('html'),
			$body = $('body');

			$wd.on('scroll.back_to_top', function(){

				if($wd.scrollTop() > config.offset){

					btn.removeClass('hide '+config.transitionOut).addClass(config.transitionIn);

				}
				else{

					btn.removeClass(config.transitionIn).addClass(config.transitionOut);

				}

			});

			btn.on('click', function(){

				$html.add($body).animate({

					scrollTop: 0

				});

			});

	   	},

		/**
		**	Header Sticky
		**/

		headerSticky: {

			init: function(){

				var self = this;
					
				self.header = $('#header');
				self.w = $(window);

				self.sticky();

				self.w.on('scroll',function(){

					self.sticky();

				});

				self.w.on('resize',function(){

					self.sticky();
					
				});

			},	

			sticky: function(){

				var self = this;
				
				self.wHeight = self.w.height();
				self.wScroll = self.w.scrollTop();
				self.headerHeight = self.header.outerHeight();

				if(self.wScroll <= self.headerHeight){

					if(self.position == 'top') return false;

					self.position = 'top';
					self.header.removeClass('sticky').stop().animate({
						"top":0
					},0);

				}
				else if(self.wScroll > self.headerHeight && self.wScroll < self.wHeight/1.5){

					if(self.position == 'hide') return false;

					if(self.position == 'top'){

						self.position = 'hide';
						self.header.addClass('sticky').stop().animate({
							'top': -self.headerHeight
						},0);

					}
					else{

						self.position = 'hide';
						self.header.stop().animate({
							'top': -self.headerHeight
						},300, function(){
							self.header.addClass('sticky');
						});

					}

				}
				else{

					if(self.position == 'sticky') return false;

					self.position = 'sticky';
					self.header.addClass('sticky');
					self.header.stop().animate({
						'top': 0
					});

				}
			
			},


		},


		/**
		**	Mobail Menu
		**/

		mobMenu: function(){

			$('.nav_mob_btn').on('click',function(){

				$('#header').toggleClass('open_menu');

			});

			$(document).on('click', function(event){

				if(!$(event.target).closest('.nav_mob_btn, .navigation').length){
					
					$('#header').removeClass('open_menu');					
				
				}

			});

		},


		/**
		**	Item box
		**/

		itemBox:{

			init: function(){
				
				var self = this;

				self.arrProt();
				self.events();
				self.boxArr = [];

				self.addBoxArr();

			},

			arrProt: function(){

				Array.prototype.move = function (old_index, new_index) {
				    if (new_index >= this.length) {
				        var k = new_index - this.length;
				        while ((k--) + 1) {
				            this.push(undefined);
				        }
				    }
				    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
				    return this; // for testing purposes
				};

			},

			addBoxArr: function(){

				var self = this;
				self.boxQt = $('.item_box').length;

				$('.item_box').each(function(index, el){
					$(el)[0].idBox = index;
					$(el).attr('data-idBox', index);

					self.boxArr.push($(el));

				});

				self.changePos();


			},

			changePos: function(){

				var self = this;

				var scale = 1,
					bottom = 0,
					zIndex = 99;
				for (var i = self.boxArr.length - 1; i >= 0; i--) {
					self.boxArr[i].css({
						'transform': 'scale('+ scale +')',
						"bottom": bottom,
						"z-index": zIndex
					});
					zIndex = zIndex -1;
					scale = scale - 0.2;
					bottom = bottom + 80;
				}

			},

			events: function(){

				var self = this;

				$('.item_box_close').on('click',function(){
					
					var item = $(this).closest('.item_box'),
						idBox = item.attr('data-idBox');
					
					for (var i = self.boxArr.length - 1; i >= 0; i--) {
						
						if (self.boxArr[i][0].idBox == idBox){

							self.boxArr.splice(i, 1);
							console.log(self.boxArr);
						}
						
					}
					item.remove();
					self.boxQt = $('.item_box').length;
					self.changePos();

				});

				$('.item_box').on('click', function(){
					
					var $this = $(this),
						idBox = $this.attr('data-idBox');

					for (var i = self.boxArr.length - 1; i >= 0; i--) {
						
						if (self.boxArr[i][0].idBox == idBox){

							var active = self.boxArr[i];
							self.boxArr.move(i, self.boxQt-1);
							self.changePos();
						}
						
					}
					

					self.changePos();
					
				});

			}
		},


		/**
		**	Progress Bar
		**/

		progressBar: function(){

			const meters = document.querySelectorAll('svg[data-value] .meter');

			meters.forEach( (path) => {
				let length = path.getTotalLength();
				let vmaxtxt = parseInt(path.parentNode.getAttribute('data-vmax'));
				let valuetxt = parseInt(path.parentNode.getAttribute('data-value'));
				let vmax = 1 / vmaxtxt * 100; 
				let value = valuetxt * vmax;
				let to = length * ((100 - value) / 100);
				path.getBoundingClientRect();
				path.style.strokeDashoffset = Math.max(0, to);  

				$(".txt_value").text(valuetxt);
				$(".txt_vmax").text(vmaxtxt);

			});
		}

	}


	$(document).ready(function(){

		Core.DOMReady();

	});

	$(window).load(function(){

		Core.windowLoad();

	});

})(jQuery);