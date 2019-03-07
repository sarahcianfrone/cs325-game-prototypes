//NAME : SARAH CIANFRONE
//GNUM : G01056588

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "fp.h"


int
computeFP(float val) {

	int BIAS = 7; //2^(4-1)-1 = 8-1 = 7
	int exponent = 0;
	float frac = val;
	int fracBin = 0;
	
	while(frac >= 2){
		frac/=2;
		exponent++;
	}
	while(frac < 1){
		frac*=2;
		exponent--;
	}
	//Now frac is in the range [1, 2) however we have to check
	//if exp is in the right range for normalized - if not
	//then make frac smaller and exp bigger to fit in the
	//range (denormalized) - if it gets too small for denorm
	//then frac should just go to 0
	while(exponent <= -BIAS){
		frac/=2;
		exponent++;
	}
	int expBits = exponent + BIAS;
	if(exponent == 1-BIAS) expBits = 0;

	if(frac == 0) return 0; //If theres underflow or 0 just stop here (for norm frac is still >= 1 so its ok
	if(expBits >= 0xF) return 0xF00; //If exp is too big just stop here

	//Get binary value from frac ( a float ) - there's probably a better way to do this but this makes sense to me
	fracBin = 0;
	float mant = frac;
	if(mant >= 1) mant--;
	//For loop instead of a while loop for simple truncation - will only look at the first 8 digits of frac
	for(int i=1;i<=8;i++){
		fracBin = fracBin << 1 & 0xFFFFE;
		if(mant >= pow(2, -i)){
			mant -= pow(2, -i);
			fracBin += 1;
		}
	}
	
			
	expBits = expBits << 8;
	int final = expBits | fracBin;
//	printf("\nFinal: 0x%04X\n", final);
	return final;
/* I kept this comment here because I wanted to be able to look over it later*/

// input: float value to be represented
// output: integer version in our representation
//
// Perform this the same way we did in class -
//    either dividing or multiplying the value by 2
//    until it is in the correct range (between 1 and 2).
//    Your exponent is the number of times this operation
//    was performed.   
// Deal with rounding by simply truncating the number.
// You will only have Positive Values.  Sign will always be 0.
// Check for overflow - 
//    with 4 exponent bits, we have overflow if the number to be 
//       stored is:
//    for overflow (exp > 14), store the value as Positive Infinity
// Check for Denormalized values as well. 
//    If M is in the form of 1.X and E is < 1-Bias, it will be Denormalized
//      If the number is too small to encode as denormalized, return 0.
}

float getFP(int val) {
// Using the defined representation, compute the floating point
//    value
// For 0, simply return 0.
// For Infinity, return -1;
	if(val == 0) return 0; //If its 0 we can just return 0 and not do all this work
	if(val == 0xF00 || val < 0) return -1; //If its infinity (or negative just to be safe) just return -1
	int expBin = (val & 0x0F00) >> 8;
	if(expBin == 0xF) return -1; //Another infinity check just to be safe (maybe a 0xF01 slipped in)
	int fracBin = (val & 0x00FF);
	int BIAS = 7;
	float m = 0;
	int e = 0;

	if(expBin == 0){
		//DENORMALIZED
		//E=1-BIAS
		e = 1-BIAS;
		//M=0.frac
	} else {
		//NORMALIZED
		//E=exp-BIAS
		for(int i=0;i<4;i++){
			if(expBin & 0x1) e+=pow(2, i);
			expBin = expBin >> 1;
		}
		e = e - BIAS;
		//M=1.frac
		fracBin+=0x100;
	}


	//The reason I added 0x100 up there ^ to fracBin and I'm iterating through 2^0 here is because
	//it makes it so I can handle m for normalized and denormalized in one for loop.
	//Since the only difference is m=0.frac for denorm and m=1.frac for normalized, if I add another 1
	//to fracBin if and only if it's normalized and then check for that when I see whether or not
	//I need to add one for m, it'll work in both cases.
	float frac = 0;
	for(int i=-8;i<=0;i++){
		if(fracBin & 0x1){
			frac += (float)pow(2, i);

		}
		fracBin = fracBin >> 1;
	}
	m = frac;
 	return pow(2, e)*m;
}

int
multVals(int source1, int source2) {
// You must implement this by using the algorithm
//    described in class:
//    Add the exponents:  E = E1+E2 
//    multiply the fractional values: M = M1*M2
//    if M too large, divide it by 2 and increment E
//    save the result
// You will only deal with positive source values
// Be sure to check for overflow - store value as Infinity
// If the value is too small for denormalized, return 0
	int BIAS = 7;

	int exp1 = ((source1 & 0xF00) >> 8);
	int exp2 = ((source2 & 0xF00) >> 8);
	int e1 = exp1-BIAS;
	int e2 = exp2-BIAS;
	if(e1 == -BIAS) e1++;
	if(e2 == -BIAS) e2++;

	int frac1 = source1 & 0xFF;
	int frac2 = source2 & 0xFF;
	
	//Get floats from frac1 and frac2
	float frac1f = 0;	
	for(int i=-8;i<0;i++){
		if(frac1 & 0x01) frac1f+=pow(2, i);
		frac1 = frac1 >> 1;
	}

	float frac2f = 0;
	for(int i=-8;i<0;i++){
		if(frac2 & 0x01) frac2f+=pow(2, i);
		frac2 = frac2 >> 1;
	}


	//Adjust frac to be = m by making them 1.frac if normalized and 0.frac is denormalized
	if(exp1 > 0) frac1f++;
	if(exp2 > 0) frac2f++;

	int e = e1+e2;
	int exp = e+BIAS;
	if(exp >> 4) return 0x0F00;
	float m = frac1f*frac2f;
	
	int fracBin = 0;
	if(m >= 1) m--;
	//make m into frac binary
	for(int i=1; i<=8;i++){
		fracBin = fracBin << 1;
		if(m >= pow(2, -i)){
			m-=pow(2, -i);
			fracBin++;
		} 
	}	
	
	exp = exp << 8;
	while(exp < 1-BIAS){
		m/=2.0;
		exp++;
	}

	//Put the exp bits next to the frac bits and return it
 	return exp | fracBin;
}

int
addVals(int source1, int source2) {
// Do this function last - it is the most difficult!
// You must implement this as described in class:
//     If needed, adjust one of the two number so that 
//        they have the same exponent E
//     Add the two fractional parts:  F1' + F2 = F
//              (assumes F1' is the adjusted F1)
//     Adjust the sum F and E so that F is in the correct range
//     
// As described in the handout, you only need to implement this for
//    positive source values
// If the sum results in overflow, return Infinity
// If the sum is 0, return 0
	int BIAS = 7;	

  	int exp1 = (source1 & 0xF00) >> 8;
	int exp2 = (source2 & 0xF00) >> 8;
	//Get e1 and e2 (the actual exponent) from exp1 and 2 
	int e1 = exp1 - BIAS;
	if(exp1 == 0) e1++;
	int e2 = exp2 - BIAS;
	if(exp2 == 0) e2++;
	//Get mantissas from fracs 1 and 2 - if normalized, add 1 to each of them
	int frac1 = source1 & 0xFF;
	int frac2 = source2 & 0xFF;
	float m1 = ((float)frac1)/0x100;
	float m2 = ((float)frac2)/0x100;
	if(exp1 != 0) m1++;
	if(exp2 != 0) m2++;
	
	//Adjust the exponents to be able to add them
	if(e1 > e2){
		while(e1 > e2){
			m2 /= 2;
			e2++;
		}
	} else {
		while(e2 > e1){
			m1/=2;
			e1++;
		}	
	}
	//Do the actual math - add them up, and then adjust m and e accordingly
	int e = e1;
	float m = m1+m2;
	while(m > 2){
		m/=2.0;
		e++;
	}	

	return computeFP(pow(2, e)*m);
}


