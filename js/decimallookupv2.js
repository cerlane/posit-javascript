/**
* @file My ugly decimal to posit lookup table generator script
* @copyright Siew Hoon Leong (Cerlane)
*/
var positMax = {
	"6_0": function(){
		return 16;
	},
	"6_1": function(){
		return 256;
	},
	"6_2": function(){
		return 65536;
	},
	"6_3": function(){
		return 4294967296;
	},
	"6_4": function(){
		return 18446744073709552000;
	},
	"8_0": function(){
		return 64;
	},
	"8_1": function(){
		return 4096;
	},
	"8_2": function(){
		return 16777216;
	},
	"8_3": function(){
		return 281474976710656;
	}, 
	"8_4": function(){
		return 7.922816251426434e+28;
	},
	"16_0": function(){
		return 16384;
	},
	"16_1": function(){
		return 268435456;
	},
	"16_2": function(){
		return 72057594037927940;
	},
	"16_3": function(){
		return 5.192296858534828e+33;
	}, 
	"16_4": function(){
		return 2.695994666715064e+67;
	},
	"32_0": function(){
		return 1073741824;
	},
	"32_1": function(){
		return 1152921504606847000;
	},
	"32_2": function(){
		return 1.329227995784916e+36;
	},
	"32_3": function(){
		return 1.7668470647783843e+72;
	},
	"32_4": function(){
		return 3.1217485503159922e+144;
	}/*,
	"64_0": function(){
		return 4611686018427388000;
	},
	"64_1": function(){
		return 2.1267647932558654e+37;
	},
	"64_2": function(){
		return 4.523128485832664e+74;
	},
	"64_3": function(){
		return 2.0458691299350887e+149;
	},
	"64_4": function(){
		return 4.185580496821357e+298;
	},
	"128_0": function(){
		return 8.507059173023462e+37;
	},
	"128_1": function(){
		return 7.237005577332262e+75;
	},
	"128_2": function(){
		return 5.237424972633827e+151;
	},
	"128_3": function(){
		return 2.7430620343968443e+303;
	}*/
};

var expvalue = {
	"0": function(){
		return 1;
	},
	"1": function(){
		return 2;
	},
	"2": function(){
		return 4;  
	},
	"3": function(){
		return 8;  
	}, 
	"4": function(){
		return 16;  
	}
};


function convertDToP(){
	var decimal = document.getElementById("decimal").value;

	var positkeys = Object.keys(positMax);	
 
	var msg = "Posit format            Binary                                        Value                             Relative Error                  Decimals of Accuracy\n";
	for (i=0; i<positkeys.length; i++){	

		var positInfo = positkeys[i].split("_");
		var ps = parseInt(positInfo[0]);
		var es = parseInt(positInfo[1]);

		//Within range
		var p_max = positMax[positkeys[i]]();
		var useed = Math.pow(2, expvalue[es]());
		var usigned_decimal = Math.abs(decimal);
		var sign = Math.sign(decimal);
		var posit = "";
		var temp = usigned_decimal;
		var value =0;

		// handling so that there is no overflow
		if (usigned_decimal > p_max){

			if(sign<0){
				posit = "1";
				k = ps -2;
				while(k>0){
					posit += "0";
					k--;
				}
				posit += "1";
			}
			else{
				posit = "0";
				k = ps-1;
				while(k>0){
					posit += "1";
					k--;
				}
			}
		}
		else if (usigned_decimal==0){

			k = ps;
			while(k>0){
				posit += "0";
				k--;
			}
		}
		else if (usigned_decimal < 1){

			//regime<1 => k<0
			
			posit += "0";
			while(true){
				temp2=temp*useed;
				if (temp2>useed){
					break;
				}
				else{
					temp = temp2;
					posit += "0";					
				}
			}
			posit += "1";
		}
		else if (usigned_decimal >=1 && usigned_decimal < useed){
			//regime = 1 => k=1 => regime is 01 or 10			
			posit = "010";
		}
		else if (usigned_decimal>=useed ){
			//regime > 1
			var j=0;
			posit +="01";
			while (temp>=useed){
				temp = temp/useed;
				j++;
				posit += "1";
			}
			posit +="0";
		}


		if(usigned_decimal>0 && usigned_decimal <= p_max){

			//value is in exponential and fraction
			var j=0;
			while (temp>=2){
				temp = temp/2;
				j++;
			}
	
			if(es>0){
				var e_binary = dec2bin(j);
				while (e_binary.length<es){
					e_binary = "0"+e_binary;
				}
				posit += e_binary;
			}
			
			f_fraction=temp.toString( 2 );

			posit += f_fraction.substring(2, f_fraction.length);
			
			while (posit.length < ps){
				posit += "0";
			}
//console.log("<"+ps+", " + es + ">");
//console.log(posit);
			if (posit.length>ps){
				//Need to round
				//faster method
				var roundPlusOne = false;
				if (posit.charAt(ps) == "1"){
					var n = ps+1;
					while(n<posit.length){
						if (posit.charAt(n) == "1"){
							roundPlusOne = true;
							break;
						}
						n++;
					}
					if (!roundPlusOne){
						//round to nearest even.
						if (posit.charAt(ps-1)=="1"){
							roundPlusOne = true;
						}
					}
				}
				if(roundPlusOne){
					posit = posit.substring(0,ps);
					var posit2 = parseInt(posit, 2) +1;
					posit2=  posit2.toString(2);
					while(posit2.length<posit.length){
						posit2 = "0"+posit2								
					}
					var value2 = calculatePositValue(posit2, ps, es);
					if (value2 == "INF"){
						//Prevent overflow
	                                        var value1 = calculatePositValue(posit, ps, es);
						value = value1;
					}
					else{
						posit = posit2;
						value = value2;
					}
				}
				else{

					posit = posit.substring(0,ps);
					var value1 = calculatePositValue(posit, ps, es);
					value = value1;

					//prevent underflow
					if (value=="0"){
						var posit2 = parseInt(posit, 2) +1;
						posit2=  posit2.toString(2);
						while(posit2.length<posit.length){
							posit2 = "0"+posit2								
						}
						var value2 = calculatePositValue(posit2, ps, es);
						posit = posit2;
						value = value2;
					}
				}
				
			}
			if(sign<0){
				var twoComplement = parseInt(posit, 2);
				posit = dec2bin(-twoComplement).substring(32-ps,32);
				value = -value;	
			}
			
		}
		

		if (value ==0){
			if(usigned_decimal==0)
				value=0;
			else
				value = calculatePositValue(posit, ps, es);
		}
		var error = 0;
		error = Math.abs((decimal-value)/decimal);
		
		
		msg += "Posit<"+ps+","+es+">		" + colouredCodedPosit(posit, es) + "	" ;
	
		var no_whitespace = "Binary".length+32 - posit.toString().length;
		while (no_whitespace>0){
			msg += " ";
			no_whitespace --;
		}

		if (posit.toString().length<8){
			msg += "      ";
		}
		msg += value;
		no_whitespace = "Binary".length+28 - value.toString().length;// 5-Math.ceil(value.toString().length/8);
		/*if (value.toString().length%8 == 0){
			no_whitespace --;
		}*/
		while (no_whitespace>0){
			//msg += "	" ;
			msg+=" ";
			no_whitespace --;
		}
		
		msg += error;

		var accuracy = -Math.log10(Math.abs(error));
		no_whitespace = 5-Math.ceil(error.toString().length/8);
		if (error.toString().length%8 == 0){
			no_whitespace --;
		}
		while (no_whitespace>0){
			msg += "	" ;
			no_whitespace --;
		}
		msg += accuracy;
		msg += "\n";
	}
	document.getElementById('output').innerHTML = msg;
	
}


function dec2bin(dec){
	return (dec >>> 0).toString(2);
}

function calculatePositValue(binary, posit, expo){
	sign = 0;
	regimesign = 0;
	isRegime = true;
	runlength = 0;
	expo_bitvalue = 0;
	fraction_bitvalue = 0;
	fractionlength =0;
	var i=parseInt(binary,2);
	var INF = "1";
	j= binary.length -1;
	while(j>0){
		INF+="0"
		j--;
	}
	if (binary == INF.toString(2)){
		value = "INF"
	}
	else if(i==0){
		value = 0;
	}
	else{
		for(j=0; j<binary.length; j++){
			if (j==0){
				sign = parseInt(binary.charAt(j));
				if(sign==0){
					sign = 1;
				}
				else if (sign==1){
					sign = -1;
					//Two's complements
					binary = dec2bin(-i).substring(32-posit,32);
					while(binary.length<posit){
                                                binary="0" + binary;
                                        }			
				}
			}
			else if (j==1){
				regimesign = parseInt(binary.charAt(j));
				runlength++
			}
			else{
				if (isRegime){
					if(parseInt(binary.charAt(j)) == regimesign){
						runlength++;
					}
					else{
						isRegime = false;
						expo_start = runlength +2;						
						expoLength_max = expo_start +parseInt(expo);
						if (parseInt(expo) > 0 && (expo_start)<binary.length){
							tmp_expo = binary.substring(expo_start, binary.length);
						
							if (tmp_expo.length>expo){
								tmp_expo = tmp_expo.substring(0, expo);
							}
							else if (tmp_expo.length<expo){
								missingzero = expo-tmp_expo.length;
								while(missingzero>0){
									tmp_expo += "0";
									missingzero --;
								}
							}
							expo_bitvalue = parseInt(tmp_expo,2);
						
						}
						//Check fraction
						if(expoLength_max<binary.length){
							fractionlength = binary.length - expoLength_max;
							tmp_frac = binary.substring(expoLength_max, binary.length);
							fraction_bitvalue = parseInt(tmp_frac, 2);
						
						}
						break;
					}
				}
			
			}
		}
		k = 0;
	
		if (regimesign==0){
			k=-(runlength);
		}
		else{
			k=runlength-1;
		}
		regime = Math.pow(Math.pow(2, Math.pow(2, expo)), k);
		expo_value = Math.pow(2, expo_bitvalue);
		fraction_max = Math.pow(2, fractionlength);
		fraction_value = 1+ (parseInt(fraction_bitvalue)/fraction_max);
		value = sign * regime * expo_value * fraction_value;
	}

	
	return value;
}

function colouredCodedPosit(posit, es){
	var signchar = "+";	
	if(posit.charAt(0)=="1"){
		signchar = "-";
	}
	var colouredPosit = "<font color='#FF2000'>"+signchar+"</font>";
	var isRegime = true;
	var regime = "";
	var terminateRegime = "";
	var expo = "";
	var fraction = "";
	var regimeBit = "0";
	for (v=1; v<posit.length; v++){
		if(v==1 && posit.charAt(v)=="1"){
			regimeBit = "1";
		}
		if(isRegime){
			if(regimeBit==posit.charAt(v)){
				regime += posit.charAt(v);
			}
			else{
				isRegime = false;
				terminateRegime = "<font color='#996633'>"+posit.charAt(v)+"</font>";
			}
		}
		else{
			if (v+es>=posit.length){
				expo += "<font color='#4080FF'>"+posit.substring(v, posit.length) +"</font>";
			}
			else{
				expo += "<font color='#4080FF'>"+posit.substring(v, v+es) +"</font>";
				if(v+es<posit.length){
					fraction += posit.substring(v+es, posit.length);
				}
			}
			break;
			
		}
		
	}
	colouredPosit += "<font color='#CC9933'>"+regime+"</font>" + terminateRegime + expo + fraction;
	return colouredPosit;
}
