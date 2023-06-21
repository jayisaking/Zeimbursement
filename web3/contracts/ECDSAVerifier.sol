// SPDX-License-Identifier: GPL-3.0
/*
    Copyright 2021 0KIMS association.

    This file is generated with [snarkJS](https://github.com/iden3/snarkjs).

    snarkJS is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    snarkJS is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with snarkJS. If not, see <https://www.gnu.org/licenses/>.
*/

pragma solidity >=0.7.0 <0.9.0;

contract ECDSAGroth16Verifier {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 20491192805390485299153009773594534940189261866228447918068658471970481763042;
    uint256 constant alphay  = 9383485363053290200918347156157836566562967994039712273449902621266178545958;
    uint256 constant betax1  = 4252822878758300859123897981450591353533073413197771768651442665752259397132;
    uint256 constant betax2  = 6375614351688725206403948262868962793625744043794305715222011528459656738731;
    uint256 constant betay1  = 21847035105528745403288232691147584728191162732299865338377159692350059136679;
    uint256 constant betay2  = 10505242626370262277552901082094356697409835680220590971873171140371331206856;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 2583879729211064084348970203909266197285399920033599275656585882014390508058;
    uint256 constant deltax2 = 11327842810633940328290397356512749521459982709298807184464949264328439584755;
    uint256 constant deltay1 = 10099275990240177735404403353142983153986801901907890716875904168514718852173;
    uint256 constant deltay2 = 21827047276272725086068647841307933277883210226263634660543315328736155000240;

    
    uint256 constant IC0x = 8297028166983054601554051601721736246752653207260532922959954315925174181119;
    uint256 constant IC0y = 20056310536319451665882737054874881330175659416131896651522431328151821739432;
    
    uint256 constant IC1x = 11886881875118370581022952116319681852617019841114687561535195265734097945030;
    uint256 constant IC1y = 15142793474712165827534638875480161284276344678000699151051362863176636933589;
    
    uint256 constant IC2x = 2776191002060736337597317553597890451711029315770631053778316716568172515149;
    uint256 constant IC2y = 11246062149554507255285184818139858601377077690099681001938609916096152332745;
    
    uint256 constant IC3x = 12333105593909660157669364434772192770911896743102353628295835704432876434641;
    uint256 constant IC3y = 13026778706540357182427354899467700866497418094572034165862033879380601958690;
    
    uint256 constant IC4x = 19949712887718090619892174054164947198343305754092282690467616440037028192612;
    uint256 constant IC4y = 12526300321847960112945183986887647970995907476239971379937741552065019773424;
    
    uint256 constant IC5x = 11387023583690724273451378588521686857667288778189671458417663420772661323601;
    uint256 constant IC5y = 21110767335894093140425053080427093124192516863689689927729391028587944336737;
    
    uint256 constant IC6x = 13188581348018144053466958297101024150142400947929081483864923770991755186911;
    uint256 constant IC6y = 11620987356901624381523911906713679539492838621458806563395332022219139952494;
    
    uint256 constant IC7x = 17057962248798651239332924811044755011922509915949924066857717807313095038385;
    uint256 constant IC7y = 5318994180340285418295535625430469896945840303727282198854795208825912485605;
    
    uint256 constant IC8x = 18813635962996606276897294189031712319016060287231099252946965146645033381485;
    uint256 constant IC8y = 7480998957392047448964251741420332244280147797882653972374923624141937067690;
    
    uint256 constant IC9x = 1927854399667331585484323298278169662462900066813242627861846110899189076781;
    uint256 constant IC9y = 15088553707010932978901122909397421095189298080595338897908575507982503855056;
    
    uint256 constant IC10x = 16848016773517687390812334318559525419397651020742860344967370692634196051701;
    uint256 constant IC10y = 15739573853892419123123086984293724699334230065148201562119593971126230847877;
    
    uint256 constant IC11x = 1668380009761976205115194536669245010819845254729712851517979910669525704419;
    uint256 constant IC11y = 19481528087209068015287662151523741337966707026933906192072808758263587737552;
    
    uint256 constant IC12x = 20830625451380721655552643914420334637431713142295599601681505899908517624977;
    uint256 constant IC12y = 17931174895503283413887130237844387062996055488090776801953753085251397834175;
    
    uint256 constant IC13x = 9776256749463353082081697265826247291485416355174960212138996880334992177608;
    uint256 constant IC13y = 14117932985911554466533663475124972250721184712373624730991869305421123358778;
    
    uint256 constant IC14x = 6549476197987859818732154497203873963034724071270491123309939651013974681974;
    uint256 constant IC14y = 12148106923427594032661063867890786339401965723599906872772061840387562141982;
    
    uint256 constant IC15x = 892493005351677404224366280701814150994175643317926187885504105745458790546;
    uint256 constant IC15y = 14982831553648903310818771564124256883351362877954434226391340030936162263702;
    
    uint256 constant IC16x = 9596036596300379153038791532908869835258526541695294433129447540640389877876;
    uint256 constant IC16y = 15285102994143906907937757128129238871434604357830080443854866354118823725789;
    
    uint256 constant IC17x = 1242065530738451521956119752162320385149679066542415254671434100670503828705;
    uint256 constant IC17y = 3583553097947931904528423564504784029920055620294208862188106943291643960370;
    
    uint256 constant IC18x = 9148078241626414264465829287892636301252331080413701817018981703316487761414;
    uint256 constant IC18y = 11030335211001920860957833676268560555292275908869400462342732348593112291049;
    
    uint256 constant IC19x = 4318223881995018413390664869763138521551551686699495393795553417883513855391;
    uint256 constant IC19y = 17696066056343606257691854310168119604709064640557929538371260476855649202223;
    
    uint256 constant IC20x = 1810597233429493161843490074508972705230782600802902909455236627085952252037;
    uint256 constant IC20y = 899115840029083654319472329077772248777978952683696087613928064669353946101;
    
    uint256 constant IC21x = 8988295000524043804367993058354456537524926254281752401622218945084951759427;
    uint256 constant IC21y = 223856152583623889599470149338346057539533341431747704554059156395723843555;
    
    uint256 constant IC22x = 18714545209525421723092585439792525550231584854917901353115761082135154387390;
    uint256 constant IC22y = 818236733208353152859949082158771062415681191872582643914310889400011320540;
    
    uint256 constant IC23x = 12019998972234817294406110679049578253828490587755964563498540776969857352246;
    uint256 constant IC23y = 21707605494779658157523821955379642046668108970247278230605895539010068540937;
    
    uint256 constant IC24x = 2806185356503223311161405287338692814126387918451838379600363206048792609373;
    uint256 constant IC24y = 17347662525138198907569775714552610914394923094921862894528617895283454055458;
    
    uint256 constant IC25x = 15835810045060983894912442806375305396729262080624253237872523911788045952530;
    uint256 constant IC25y = 4751471594530777848724920796170188277370428756332935421295808831176992298710;
    
    uint256 constant IC26x = 4598162674115066264034085975539009972993058800220855373851418745423581052698;
    uint256 constant IC26y = 9578137877355814423470676788105683731022775324470804311064639341111266326927;
    
    uint256 constant IC27x = 11723235801449071547825698864749178289148687852520587013042489963155440738807;
    uint256 constant IC27y = 8970534984593519253394755686495034315234787265686548282841954185166314246023;
    
    uint256 constant IC28x = 14203895305612646755648271892220972273570791973714940982906016833977102905888;
    uint256 constant IC28y = 11859462054564791936860248644631856036050967442066200173983108299754006602319;
    
    uint256 constant IC29x = 11605539367023579621916699547080008370828949725277764278609044312045372599986;
    uint256 constant IC29y = 19525849544102353894357131713104876749356875453106755792202484732799630822081;
    
    uint256 constant IC30x = 15439042140521265236914733439306485280372299614563628759170382568368491804490;
    uint256 constant IC30y = 19709617784835521342611122364649208339742484804971313006161726241388876181639;
    
    uint256 constant IC31x = 717925211537596502041133903475726208036644416267903382410611633130959806852;
    uint256 constant IC31y = 14865149368477699269328293090654183341733346990761503046578901201229009961812;
    
    uint256 constant IC32x = 3252719838546126088721601646833760891298474294790761807708202691177281916723;
    uint256 constant IC32y = 11565568611463415625161607722821920897689103801703622165010955457672085784994;
    
    uint256 constant IC33x = 5614554043263558912763640664923881906728617867134183632792396676102583429925;
    uint256 constant IC33y = 15282722857591963137031059648920059487478889923764326093091750852613429657919;
    
    uint256 constant IC34x = 7875947011824805180767113381064778532831746053173365054528628226653049867123;
    uint256 constant IC34y = 9061765070223014478133166521441160222978460271401719999999870539634262695901;
    
    uint256 constant IC35x = 8513246589623486689180025098741559361822289492350833112245579074173246587046;
    uint256 constant IC35y = 18702385660270770550215648587585934680836374992707555986523985347457551495263;
    
    uint256 constant IC36x = 8613953399272661459016961222073702572936056041343217448622854247471663220085;
    uint256 constant IC36y = 14336680646200834245667536518095117994536083333054286626469736949044737807662;
    
    uint256 constant IC37x = 6944321218295269644947289616754585541851149119896791338817184359210400810905;
    uint256 constant IC37y = 11746630975746488786944415730524810749023512598594572562210907923218523957060;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[37] calldata _pubSignals) public view returns (bool) {
        assembly {
            function checkField(v) {
                if iszero(lt(v, q)) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }
            
            // G1 function to multiply a G1 value(x,y) to value in an address
            function g1_mulAccC(pR, x, y, s) {
                let success
                let mIn := mload(0x40)
                mstore(mIn, x)
                mstore(add(mIn, 32), y)
                mstore(add(mIn, 64), s)

                success := staticcall(sub(gas(), 2000), 7, mIn, 96, mIn, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }

                mstore(add(mIn, 64), mload(pR))
                mstore(add(mIn, 96), mload(add(pR, 32)))

                success := staticcall(sub(gas(), 2000), 6, mIn, 128, pR, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }

            function checkPairing(pA, pB, pC, pubSignals, pMem) -> isOk {
                let _pPairing := add(pMem, pPairing)
                let _pVk := add(pMem, pVk)

                mstore(_pVk, IC0x)
                mstore(add(_pVk, 32), IC0y)

                // Compute the linear combination vk_x
                
                g1_mulAccC(_pVk, IC1x, IC1y, calldataload(add(pubSignals, 0)))
                
                g1_mulAccC(_pVk, IC2x, IC2y, calldataload(add(pubSignals, 32)))
                
                g1_mulAccC(_pVk, IC3x, IC3y, calldataload(add(pubSignals, 64)))
                
                g1_mulAccC(_pVk, IC4x, IC4y, calldataload(add(pubSignals, 96)))
                
                g1_mulAccC(_pVk, IC5x, IC5y, calldataload(add(pubSignals, 128)))
                
                g1_mulAccC(_pVk, IC6x, IC6y, calldataload(add(pubSignals, 160)))
                
                g1_mulAccC(_pVk, IC7x, IC7y, calldataload(add(pubSignals, 192)))
                
                g1_mulAccC(_pVk, IC8x, IC8y, calldataload(add(pubSignals, 224)))
                
                g1_mulAccC(_pVk, IC9x, IC9y, calldataload(add(pubSignals, 256)))
                
                g1_mulAccC(_pVk, IC10x, IC10y, calldataload(add(pubSignals, 288)))
                
                g1_mulAccC(_pVk, IC11x, IC11y, calldataload(add(pubSignals, 320)))
                
                g1_mulAccC(_pVk, IC12x, IC12y, calldataload(add(pubSignals, 352)))
                
                g1_mulAccC(_pVk, IC13x, IC13y, calldataload(add(pubSignals, 384)))
                
                g1_mulAccC(_pVk, IC14x, IC14y, calldataload(add(pubSignals, 416)))
                
                g1_mulAccC(_pVk, IC15x, IC15y, calldataload(add(pubSignals, 448)))
                
                g1_mulAccC(_pVk, IC16x, IC16y, calldataload(add(pubSignals, 480)))
                
                g1_mulAccC(_pVk, IC17x, IC17y, calldataload(add(pubSignals, 512)))
                
                g1_mulAccC(_pVk, IC18x, IC18y, calldataload(add(pubSignals, 544)))
                
                g1_mulAccC(_pVk, IC19x, IC19y, calldataload(add(pubSignals, 576)))
                
                g1_mulAccC(_pVk, IC20x, IC20y, calldataload(add(pubSignals, 608)))
                
                g1_mulAccC(_pVk, IC21x, IC21y, calldataload(add(pubSignals, 640)))
                
                g1_mulAccC(_pVk, IC22x, IC22y, calldataload(add(pubSignals, 672)))
                
                g1_mulAccC(_pVk, IC23x, IC23y, calldataload(add(pubSignals, 704)))
                
                g1_mulAccC(_pVk, IC24x, IC24y, calldataload(add(pubSignals, 736)))
                
                g1_mulAccC(_pVk, IC25x, IC25y, calldataload(add(pubSignals, 768)))
                
                g1_mulAccC(_pVk, IC26x, IC26y, calldataload(add(pubSignals, 800)))
                
                g1_mulAccC(_pVk, IC27x, IC27y, calldataload(add(pubSignals, 832)))
                
                g1_mulAccC(_pVk, IC28x, IC28y, calldataload(add(pubSignals, 864)))
                
                g1_mulAccC(_pVk, IC29x, IC29y, calldataload(add(pubSignals, 896)))
                
                g1_mulAccC(_pVk, IC30x, IC30y, calldataload(add(pubSignals, 928)))
                
                g1_mulAccC(_pVk, IC31x, IC31y, calldataload(add(pubSignals, 960)))
                
                g1_mulAccC(_pVk, IC32x, IC32y, calldataload(add(pubSignals, 992)))
                
                g1_mulAccC(_pVk, IC33x, IC33y, calldataload(add(pubSignals, 1024)))
                
                g1_mulAccC(_pVk, IC34x, IC34y, calldataload(add(pubSignals, 1056)))
                
                g1_mulAccC(_pVk, IC35x, IC35y, calldataload(add(pubSignals, 1088)))
                
                g1_mulAccC(_pVk, IC36x, IC36y, calldataload(add(pubSignals, 1120)))
                
                g1_mulAccC(_pVk, IC37x, IC37y, calldataload(add(pubSignals, 1152)))
                

                // -A
                mstore(_pPairing, calldataload(pA))
                mstore(add(_pPairing, 32), mod(sub(q, calldataload(add(pA, 32))), q))

                // B
                mstore(add(_pPairing, 64), calldataload(pB))
                mstore(add(_pPairing, 96), calldataload(add(pB, 32)))
                mstore(add(_pPairing, 128), calldataload(add(pB, 64)))
                mstore(add(_pPairing, 160), calldataload(add(pB, 96)))

                // alpha1
                mstore(add(_pPairing, 192), alphax)
                mstore(add(_pPairing, 224), alphay)

                // beta2
                mstore(add(_pPairing, 256), betax1)
                mstore(add(_pPairing, 288), betax2)
                mstore(add(_pPairing, 320), betay1)
                mstore(add(_pPairing, 352), betay2)

                // vk_x
                mstore(add(_pPairing, 384), mload(add(pMem, pVk)))
                mstore(add(_pPairing, 416), mload(add(pMem, add(pVk, 32))))


                // gamma2
                mstore(add(_pPairing, 448), gammax1)
                mstore(add(_pPairing, 480), gammax2)
                mstore(add(_pPairing, 512), gammay1)
                mstore(add(_pPairing, 544), gammay2)

                // C
                mstore(add(_pPairing, 576), calldataload(pC))
                mstore(add(_pPairing, 608), calldataload(add(pC, 32)))

                // delta2
                mstore(add(_pPairing, 640), deltax1)
                mstore(add(_pPairing, 672), deltax2)
                mstore(add(_pPairing, 704), deltay1)
                mstore(add(_pPairing, 736), deltay2)


                let success := staticcall(sub(gas(), 2000), 8, _pPairing, 768, _pPairing, 0x20)

                isOk := and(success, mload(_pPairing))
            }

            let pMem := mload(0x40)
            mstore(0x40, add(pMem, pLastMem))

            // Validate that all evaluations ∈ F
            
            checkField(calldataload(add(_pubSignals, 0)))
            
            checkField(calldataload(add(_pubSignals, 32)))
            
            checkField(calldataload(add(_pubSignals, 64)))
            
            checkField(calldataload(add(_pubSignals, 96)))
            
            checkField(calldataload(add(_pubSignals, 128)))
            
            checkField(calldataload(add(_pubSignals, 160)))
            
            checkField(calldataload(add(_pubSignals, 192)))
            
            checkField(calldataload(add(_pubSignals, 224)))
            
            checkField(calldataload(add(_pubSignals, 256)))
            
            checkField(calldataload(add(_pubSignals, 288)))
            
            checkField(calldataload(add(_pubSignals, 320)))
            
            checkField(calldataload(add(_pubSignals, 352)))
            
            checkField(calldataload(add(_pubSignals, 384)))
            
            checkField(calldataload(add(_pubSignals, 416)))
            
            checkField(calldataload(add(_pubSignals, 448)))
            
            checkField(calldataload(add(_pubSignals, 480)))
            
            checkField(calldataload(add(_pubSignals, 512)))
            
            checkField(calldataload(add(_pubSignals, 544)))
            
            checkField(calldataload(add(_pubSignals, 576)))
            
            checkField(calldataload(add(_pubSignals, 608)))
            
            checkField(calldataload(add(_pubSignals, 640)))
            
            checkField(calldataload(add(_pubSignals, 672)))
            
            checkField(calldataload(add(_pubSignals, 704)))
            
            checkField(calldataload(add(_pubSignals, 736)))
            
            checkField(calldataload(add(_pubSignals, 768)))
            
            checkField(calldataload(add(_pubSignals, 800)))
            
            checkField(calldataload(add(_pubSignals, 832)))
            
            checkField(calldataload(add(_pubSignals, 864)))
            
            checkField(calldataload(add(_pubSignals, 896)))
            
            checkField(calldataload(add(_pubSignals, 928)))
            
            checkField(calldataload(add(_pubSignals, 960)))
            
            checkField(calldataload(add(_pubSignals, 992)))
            
            checkField(calldataload(add(_pubSignals, 1024)))
            
            checkField(calldataload(add(_pubSignals, 1056)))
            
            checkField(calldataload(add(_pubSignals, 1088)))
            
            checkField(calldataload(add(_pubSignals, 1120)))
            
            checkField(calldataload(add(_pubSignals, 1152)))
            
            checkField(calldataload(add(_pubSignals, 1184)))
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
