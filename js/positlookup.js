/**
 * @file My ugly posit lookup table generator script
 * @copyright Siew Hoon Leong (Cerlane)
 */
function positConvert(){
	posit = parseInt(document.getElementById("posit").value);
	expo = parseInt(document.getElementById("expo").value);
	max_value = Math.pow(2, posit);
	half_max = max_value/2;
	
	msg="#      Bits                Decoding                k-value     sign     regime                    exponent     fraction               value   \n";
	for (i=0; i<max_value; i++){
		msg += i + ": ";
		binary = dec2bin(i);
		while(binary.length<posit){
			binary = "0"+binary;
		}
		no_whitespace = 5 - i.toString().length;
		msg += addWhitespace(no_whitespace);
		var hw_binary=binary;
		
		//msg += binary;
		var colouredBinary="";
		sign = 0;
		regimesign = 0;
		isRegime = true;
		runlength = 0;
		expo_bitvalue = 0;
		fraction_bitvalue = 0;
		fractionlength =0;

		regimeBits = "";
		expoBits ="";
		fracBits ="";
		for(j=0; j<binary.length; j++){	
			if (j==0){
				sign = parseInt(binary.charAt(j));
				var signchar= "+";				
				if(sign==0){
					sign = 1;
				}
				else if (sign==1){
					sign = -1;
					signchar = "-";
					//Two's complements
					binary = dec2bin(-i).substring(32-posit,32);					
				}
				colouredBinary = "<font color='#FF2000'>"+signchar+"</font>";
			}
			else if (j==1){
				regimesign = parseInt(binary.charAt(j));
				regimeBits+=binary.charAt(j);
				runlength++;
				
			}
			else{
				if (isRegime){
					if(parseInt(binary.charAt(j)) == regimesign){
						regimeBits+=binary.charAt(j);
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
							expoBits = tmp_expo;
						}
						
						//Check fraction
						if(expoLength_max<binary.length){
							fractionlength = binary.length - expoLength_max;
							tmp_frac = binary.substring(expoLength_max, binary.length);
							fraction_bitvalue = parseInt(tmp_frac, 2);
							//msg += "     '" +expoLength_max +","+ tmp_frac  + "'      ";
						
							fracBits = tmp_frac;
						}
						
						break;
						
					}
				}
				
			}
		}

		msg+=hw_binary;


		//To print in colours
		
		colouredBinary += "<font color='#CC9933'>"+regimeBits+"</font>";
		if(regimeBits.length+1<posit){
			colouredBinary += "<font color='#996633'>"+binary.substring(regimeBits.length+1, regimeBits.length+2)+"</font>";
			var bitsleft=0;
			if (regimeBits.length+2<posit){
				bitsleft = posit-(regimeBits.length+2);
				if (bitsleft<expo){
					expoBits = expoBits.substring(0,bitsleft);
				}
				else if (bitsleft==0){
					expoBits="";
				}
				colouredBinary += "<font color='#4080FF'>"+expoBits+"</font>";
				bitsleft -=expoBits.length;
				if(bitsleft>0){
					colouredBinary += fracBits.substring(0,bitsleft);	
				}
			}
			
		}

		no_whitespace = "Bits".length+16 - binary.length;
		msg += addWhitespace(no_whitespace);
		if (i==0){
			msg += "+"+ binary.substring(1, binary.length);
		}
		else if (i==half_max){
			msg += "-"+ binary.substring(1, binary.length);
		}
		else{
			msg+=colouredBinary;
		}
		
		
		
		
		
		no_whitespace = "Decoding".length+16 - binary.length;
		msg += addWhitespace(no_whitespace);
		k = 0;
		if (regimesign==0){
			k=-(runlength);
		}
		else{
			k=runlength-1;
		}
		msg += k;


		no_whitespace = "k-value".length + 5 - k.toString().length;
		msg += addWhitespace(no_whitespace);
		msg += sign;

		regime = Math.pow(Math.pow(2, Math.pow(2, expo)), k);
		no_whitespace = "sign".length + 5 - sign.toString().length;
		msg += addWhitespace(no_whitespace);
		if (i==0){
			msg += "0";
			no_whitespace = "regime".length + 19;
		}
               	else if (i==half_max){
		       msg += "INF";
		       no_whitespace = "regime".length + 17;
	       	}
		else{
			msg += regime;
			no_whitespace = "regime".length + 20 - regime.toString().length;
		}
		expo_value = Math.pow(2, expo_bitvalue);
		//no_whitespace = "regime".length + 20 - regime.toString().length;
		msg += addWhitespace(no_whitespace);
		msg += expo_value;

		fraction_max = Math.pow(2, fractionlength);
		faction_value = 1+ (parseInt(fraction_bitvalue)/fraction_max);
		no_whitespace = "exponent".length + 5 - expo_value.toString().length;
		msg += addWhitespace(no_whitespace);
		msg += faction_value;

		value = sign * regime * expo_value * faction_value;

		no_whitespace = "fraction".length + 15 - faction_value.toString().length;
		msg += addWhitespace(no_whitespace);
		if (i==0){
			msg += 0;
		}
		else if (i==half_max){
			msg += "INF";
		}
		else{
			msg += value;
		}		
		
		issac_value = sign * Math.pow(2, 2*regime+expo_value) + Math.pow(2, 2*(regime+expo_value))* faction_value; 
		no_whitespace = "value".length + 5 - value.toString().length;
		msg += addWhitespace(no_whitespace);
		
		//msg += issac_value;
		//msg += fraction_bitvalue;
		msg += "   \n";

	}
	document.getElementById('output').innerHTML = msg;
	
}

function addWhitespace(no_whitespace){
	ws = '';
	while(no_whitespace>0){
		ws+=" ";
		no_whitespace --;
	}
	return ws;
}
function dec2bin(dec){
	return (dec >>> 0).toString(2);
}

function checkPosit(val, e_val){
	var msg='';
	if (val<2 || val>32){
		msg+= 'Posit bit size must be between 2 to 16.\n';
	}
	if (e_val>4){
		msg+='Exponential bit size must be <=4\n';
	}
	if (msg=='')
		positConvert();
	else
		document.getElementById('output').innerHTML = msg;
}

