__SCREEN_SIZE__=[93,35]             //[x,y] need at least 2 lines of free y to against the jiggling when holding a key
__PIXEL__={"void":" ","fill":164}   //not working rn
init_frame=function(frame=[],width=__SCREEN_SIZE__[0],height=__SCREEN_SIZE__[1])
    for x in range(0,width-1)
        frame.push([])
        for y in range(0,height-1)
            frame[x].push(__PIXEL__.void)
        end for
    end for
    return frame
end function
__FRAME__=[]
__FRAME__=init_frame(__FRAME__,__SCREEN_SIZE__[0],__SCREEN_SIZE__[1])     //initiating default frame
__ITEMS__={}                        //create item list

render_frame=function(frame=__FRAME__)
    clear_screen
    row_y=[]
    //print(frame.values)
    for _y in range(0,__SCREEN_SIZE__[1]-1)
        row_x=[]
        for _x in range(0,__SCREEN_SIZE__[0]-1)
            row_x.push(frame[_x][_y])
        end for
        row_y.push(row_x.join)
    end for
    print(row_y.join("\n"))
end function

fill=function(frame=__FRAME__,pix=" ")
    for x in range(0,frame.len-1)
        for y in range(0,frame[0].len-1)
            frame[x][y]=pix
        end for
    end for
end function

draw_rect=function(frame=__FRAME__,x=0,y=0,len_x=1,len_y=1,fill=true,pix=164)
    if typeof(pix)!="string" then pix=char(pix)
    //print(pix+" x:"+x+" y:"+y+" xLen:"+len_x+" yLen:"+len_y)
    if fill then                                        //solid rectangle
        for _x in range(x,x+(len_x-1))
            for _y in range(y,y+(len_y-1))
                frame[_x][_y]=pix
            end for
        end for
    else                                                //hollowed rectangle
        for _x in range(x,x+(len_x-1))
            for _y in range(y,y+(len_y-1))
                if _x==x or _x==x+(len_x-1) then
                    frame[_x][_y]=pix
                else
                    if _y==y or _y==y+(len_y-1) then
                        frame[_x][_y]=pix
                    end if
                end if
            end for
        end for
    end if
end function

draw_text=function(frame=__FRAME__,str,x=0,y=0,horizon=true)
    for i in range(0,str.len-1)
        if horizon then
            if x+i<frame.len then frame[x+i][y]=str[i]
        else
            if y+i<frame[0].len then frame[x][y+i]=str[i]
        end if
    end for
end function

copy_frame=function(frame=[])
    new_frame=[]
    new_frame=init_frame(new_frame,frame.len,frame[0].len)
    for x in range(0,frame.len-1)
        for y in range(0,frame[x].len-1)
            new_frame[x][y]=frame[x][y]
        end for
    end for
    return new_frame
end function

put_frameA_on_B=function(A=[],B=[],offset_x=0,offset_y=0)
    frame=copy_frame(B)
    for x in range(offset_x,A.len-1+offset_x)
        for y in range(offset_y,A[0].len-1+offset_y)
            frame[x][y]=A[x-offset_x][y-offset_y]
        end for
    end for
    return frame
end function

SHA256 = function(input)
	
	Blocks = [[0]]
	i=0
	e=0
	while i < input.len
		e=4
		while e > 0 and input.hasIndex(i)
			e=e-1
			Blocks[-1][-1] = Blocks[-1][-1] + code(input[i])*256^e
			i=i+1
		end while
		if e == 0 then
			if Blocks[-1].len == 16 then Blocks = Blocks + [[0]] else Blocks[-1] = Blocks[-1] + [0]
		end if
	end while
	
	if e > 0 then
		Blocks[-1][-1] = Blocks[-1][-1] + (2147483648/256^(4-e))
	else
		Blocks[-1][-1] = 2147483648
	end if
	
	if Blocks[-1].len == 16 then Blocks = Blocks + [[0]]
	while Blocks[-1].len != 15
		Blocks[-1] = Blocks[-1] + [0]
	end while
	
	Blocks[-1] = Blocks[-1] + [input.len*8]
	
	add = function(a, b)
		return (a + b) % 4294967296
	end function
	
	XOR = function(a, b)
		return bitwise("^", floor(a/65536), floor(b/65536))*65536+bitwise("^", a%65536, b%65536)
	end function
	
	AND = function(a, b)
		return bitwise("&", floor(a/65536), floor(b/65536))*65536+bitwise("&", a%65536, b%65536)
	end function
	
	OR = function(a, b)
		return bitwise("|", floor(a/65536), floor(b/65536))*65536+bitwise("|", a%65536, b%65536)
	end function
	
	NOT = function(n)
		return 4294967295-n
	end function
	
	Ch = function(x, y, z)
		return OR(AND(x, y), AND(NOT(x), z))
	end function
	
	Maj = function(x, y, z)
		return OR(OR(AND(x, y), AND(x, z)), AND(y, z))
	end function
	
	shr = function(n, shifts)
		return floor(n/2^shifts)
	end function
	
	rotr = function(n, rots)
		rots = 2^rots
		return (n % rots) * (4294967296/rots) + floor(n/rots)
	end function
	
	sigma0 = function(n)
		return XOR(XOR(rotr(n, 7), rotr(n, 18)), shr(n, 3))
	end function
	
	sigma1 = function(n)
		return XOR(XOR(rotr(n, 17), rotr(n, 19)), shr(n, 10))
	end function
	
	SIGMA0 = function(n)
		return XOR(XOR(rotr(n, 2), rotr(n, 13)), rotr(n, 22))
	end function
	
	SIGMA1 = function(n)
		return XOR(XOR(rotr(n, 6), rotr(n, 11)), rotr(n, 25))
	end function
	
	K = []
	K = K + [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221]
	K = K + [3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580]
	K = K + [3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986]
	K = K + [2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895]
	K = K + [666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037]
	K = K + [2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344]
	K = K + [430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779]
	K = K + [1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]
	
	H = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]
	
	for Block in Blocks
		W = Block[0:]
		
		for i in range(16, 63)
			W = W + [add(add(add(sigma1(W[i-2]), W[i-7]), sigma0(W[i-15])), W[i-16])]
		end for
		
		a = H[0]
		b = H[1]
		c = H[2]
		d = H[3]
		e = H[4]
		f = H[5]
		g = H[6]
		h = H[7]
		
		for i in range(0, 63)
			T1 = add(add(add(add(SIGMA1(e), Ch(e, f, g)), h), K[i]), W[i])
			T2 = add(SIGMA0(a), Maj(a, b, c))
			h = g
			g = f
			f = e
			e = add(d, T1)
			d = c
			c = b
			b = a
			a = add(T1, T2)
		end for
		H[0] = add(a, H[0])
		H[1] = add(b, H[1])
		H[2] = add(c, H[2])
		H[3] = add(d, H[3])
		H[4] = add(e, H[4])
		H[5] = add(f, H[5])
		H[6] = add(g, H[6])
		H[7] = add(h, H[7])
	end for
	
	hexTable = "0123456789abcdef"
	hash = ""
	for i in H.indexes
		for j in range(7)
			hash = hash + hexTable[floor(H[i]/16^j) % 16]
		end for
	end for
	return hash
end function

__ITEMS__.item_list=["saw ","cig ","beer","cuff","glas"]
__ITEMS__.is_sawed=false
__ITEMS__.phase_num=-1
__ITEMS__.round_num=1
__ITEMS__.live_fired_num=0
__ITEMS__.shoot_self_num=0
__ITEMS__.shoot_self_sawed_num=0
__ITEMS__.used_cig_num=0
__ITEMS__.used_beer_num=0
__ITEMS__.used_glas_live=0
__ITEMS__.used_glas_blank=0
__ITEMS__.got_shot_by_dealer=0
__ITEMS__.got_sawed_shot_by_dealer=0
__ITEMS__.dealer_shoot_self=0
cheat=false
if params.len then cheat=SHA256(params[0])=="7e061b34d521856f0defa8e7db6e8421cd257ad9a607dae529f436015d634b28"

clear_screen
Your_name=user_input("Please sign the waiver.******")
while Your_name.len>6
    print "...\n6 letters max..."
    Your_name=user_input("Please sign the waiver.******")
end while

has_item=function(items,item)
    for i in range(0,7)
        if items[i][0]==item then return i
    end for
    return null
end function

gen_shells=function(num)
    list=[]
    valid=false
    while not valid
        list=[]
        for i in range(0,num-1)
            list.push(round(round(rnd*9)/10))
        end for
        if list.sum==0 or num-list.sum==0 then continue
        valid=true
    end while
    return {"current_shell":list[0],"total_num":num,"live_num":list.sum,"blank_num":num-list.sum,"list":list}
end function

new_round=function()
    gen_items=function(num)
        list=[]
        for i in range(0,num-1)
            list.push(__ITEMS__.item_list[round(rnd*(__ITEMS__.item_list.len-1))])
        end for
        return list
    end function

    __ITEMS__.round_num=__ITEMS__.round_num+1
    __ITEMS__.Player.cuffed_turn=0
    __ITEMS__.Player.is_cuffed=false
    __ITEMS__.Dealer.cuffed_turn=0
    __ITEMS__.Dealer.is_cuffed=false
    item_num=1+round(rnd*3)
    player_items=gen_items(item_num)
    dealer_items=gen_items(item_num)
    for i in range(0,7)
        if __ITEMS__.Player.items[i][0]=="empty" and player_items.len!=0 then __ITEMS__.Player.items[i][0]=player_items.pop
        if __ITEMS__.Dealer.items[i][0]=="empty" and dealer_items.len!=0 then __ITEMS__.Dealer.items[i][0]=dealer_items.pop
    end for
end function

new_phase=function(hp)
    gen_items=function(num)
        list=[["empty",0],["empty",1],["empty",2],["empty",3],["empty",4],["empty",5],["empty",6],["empty",7]]
        for i in range(0,num-1)
            list[i][0]=__ITEMS__.item_list[round(rnd*(__ITEMS__.item_list.len-1))]
        end for
        return list
    end function

    __ITEMS__.phase_num=__ITEMS__.phase_num+1
    __ITEMS__.round_num=1
    item_num=1+round(rnd*3)
    __ITEMS__.Player={"cuffed_turn":0,"is_cuffed":false,"max_hp":hp,"hp":hp,"items":gen_items(item_num)}
    __ITEMS__.Dealer={"cuffed_turn":0,"is_cuffed":false,"max_hp":hp,"hp":hp,"items":gen_items(item_num)}
end function

shells=gen_shells(2+round(rnd*6))
new_phase(round(2+rnd*4))

__ITEMS__["item_cursor"]={"x":0,"y":1}
item_frame=init_frame([],4,3)
item_frame_base=init_frame([],29,35)
for y in range(0,4)
    for x in range(0,3)
        if y<2 then
            draw_rect(item_frame_base,x*7,y*7,8,8,false,"*")
        else if y==2 then
            draw_rect(item_frame_base,0,14,29,7,false,"*")
            break
        else if y>2 then
            draw_rect(item_frame_base,x*7,20+(y-3)*7,8,8,false,"*")
        end if
    end for
end for
draw_text(item_frame_base,"Pickup the gun",ceil(item_frame_base.len/2)-ceil("Pickup the gun".len/2),17)
__ITEMS__.shoot_target="Dealer"
shoot_frame_base=init_frame([],29,35)
draw_rect(shoot_frame_base,0,0,29,35,false,"*")
draw_text(shoot_frame_base,"Dealer",ceil(shoot_frame_base.len/2)-ceil("Dealer".len/2),3)
draw_text(shoot_frame_base,"SHOOT",ceil(shoot_frame_base.len/2)-ceil("SHOOT".len/2),ceil(shoot_frame_base[0].len/2))
draw_text(shoot_frame_base,Your_name,ceil(shoot_frame_base.len/2)-ceil(Your_name.len/2),shoot_frame_base[0].len-4)

stats_frame_base=init_frame([],12,35)
draw_rect(stats_frame_base,0,0,12,35,false,"*")
draw_text(stats_frame_base,"Dealer",2,3)
draw_text(stats_frame_base,"HP:",2,4)
draw_text(stats_frame_base,"HP:",2,32)
draw_text(stats_frame_base,Your_name,2,33)
draw_text(stats_frame_base,"Shells:",2,10)
draw_text(stats_frame_base,"Phase:",2,17)
draw_text(stats_frame_base,"Round:",2,18)
stats_frame_sprite=init_frame([],12,35)
stats_frame_sprite=put_frameA_on_B(stats_frame_base,stats_frame_sprite)
for i in range(1,shells.live_num)
    if shells.live_num!=0 then stats_frame_sprite[i+1][11]="<color=#ff0000>I</color>"
end for
for i in range(1,shells.blank_num)
    if shells.blank_num!=0 then stats_frame_sprite[i+1][12]="<color=#0000ff>I</color>"
end for
if cheat then
    for i in range(0,shells.total_num-1)                            //CHEAT shells order
        if shells.list.len then stats_frame_sprite[i+2][13]="<color=#ffff00>"+shells.list[i]+"</color>"
    end for
end if
draw_text(stats_frame_sprite,str(__ITEMS__.Dealer.hp),5,4)
if __ITEMS__.Dealer.is_cuffed then draw_text(stats_frame_sprite,"Cuffed",2,5)
if __ITEMS__.is_sawed then draw_text(stats_frame_sprite,"sawed",2,20)
if __ITEMS__.Player.is_cuffed then draw_text(stats_frame_sprite,"Cuffed",2,31)
draw_text(stats_frame_sprite,str(__ITEMS__.Player.hp),5,32)
draw_text(stats_frame_sprite,str(__ITEMS__.phase_num%3+1),8,17)
draw_text(stats_frame_sprite,str(__ITEMS__.round_num),8,18)

item_frame_sprite=init_frame([],29,35)
item_frame_sprite=put_frameA_on_B(item_frame_base,item_frame_sprite)
if __ITEMS__.item_cursor.y<1 then
    draw_rect(item_frame_sprite,1,15,27,5,false)
else
    draw_rect(item_frame_sprite,__ITEMS__.item_cursor.x*7+1,13+__ITEMS__.item_cursor.y*7+1,6,6,false)
end if
for i in range(0,7)                                             //draw items
    o=__ITEMS__.Player.items[i][1]
    x=o%4
    y=floor(o/4)
    text=__ITEMS__.Player.items[i][0]
    if text!="empty" then draw_text(item_frame_sprite,text,2+x*7,23+y*7)
    o=__ITEMS__.Dealer.items[i][1]
    x=o%4
    y=floor(o/4)
    text=__ITEMS__.Dealer.items[i][0]
    if text!="empty" then draw_text(item_frame_sprite,text,2+x*7,3+y*7)
end for
__FRAME__=put_frameA_on_B(stats_frame_sprite,__FRAME__,32,0)
__FRAME__=put_frameA_on_B(item_frame_sprite,__FRAME__,0,0)
render_frame(__FRAME__)

start_time=time
fpstime=1.0/20.0
frametime=time
while true
    dtime=time-frametime
    if dtime<fpstime and fpstime-dtime>=0.01 then wait(fpstime-dtime)               //limit fps when holding
    key=user_input("use ""WASD"" to move cursor, use ""E"" to confirm",false,true)
    frametime=time
    if key=="w" and __ITEMS__.item_cursor.y-1>=0 then __ITEMS__.item_cursor.y=__ITEMS__.item_cursor.y-1
    if key=="s" and __ITEMS__.item_cursor.y+1<item_frame[0].len then __ITEMS__.item_cursor.y=__ITEMS__.item_cursor.y+1
    if key=="a" and __ITEMS__.item_cursor.x-1>=0 then __ITEMS__.item_cursor.x=__ITEMS__.item_cursor.x-1
    if key=="d" and __ITEMS__.item_cursor.x+1<item_frame.len then __ITEMS__.item_cursor.x=__ITEMS__.item_cursor.x+1
    if key=="e" and __ITEMS__.item_cursor.y==0 then
        shoot_frame_sprite=init_frame([],29,35)
        shoot_frame_sprite=put_frameA_on_B(shoot_frame_base,shoot_frame_sprite)
        if __ITEMS__.shoot_target=="Dealer" then
            draw_rect(shoot_frame_sprite,ceil(shoot_frame_base.len/2)-ceil("Dealer".len/2)-1,2,"Dealer".len+2,3,false)
        else
            draw_rect(shoot_frame_sprite,ceil(shoot_frame_base.len/2)-ceil(Your_name.len/2)-1,shoot_frame_base[0].len-5,Your_name.len+2,3,false)
        end if
        __FRAME__=put_frameA_on_B(shoot_frame_sprite,__FRAME__)
        render_frame(__FRAME__)
        while true
            dealer_turn=true
            dtime=time-frametime
            if dtime<fpstime and fpstime-dtime>=0.01 then wait(fpstime-dtime)               //limit fps when holding
            key=user_input("use ""WS"" to move cursor, use ""E"" to confirm",false,true)
            frametime=time
            if key=="w" then __ITEMS__.shoot_target="Dealer"
            if key=="s" then __ITEMS__.shoot_target="You"
            if key=="e" then 
                //TODO:shoot handle
                shoot_frame_sprite=init_frame([],29,35)
                shoot_frame_sprite=put_frameA_on_B(shoot_frame_base,shoot_frame_sprite)
                if shells.current_shell then
                    if __ITEMS__.shoot_target=="Dealer" then
                        __ITEMS__.Dealer.hp=__ITEMS__.Dealer.hp-1
                        if __ITEMS__.is_sawed then __ITEMS__.Dealer.hp=__ITEMS__.Dealer.hp-1
                    else
                        __ITEMS__.Player.hp=__ITEMS__.Player.hp-1
                        if __ITEMS__.is_sawed then 
                            __ITEMS__.Player.hp=__ITEMS__.Player.hp-1
                            __ITEMS__.shoot_self_sawed_num=__ITEMS__.shoot_self_sawed_num+1
                        end if
                        __ITEMS__.shoot_self_num=__ITEMS__.shoot_self_num+1
                    end if
                    __ITEMS__.live_fired_num=__ITEMS__.live_fired_num+1
                    shells.live_num=shells.live_num-1
                    draw_text(shoot_frame_sprite,"BANG! It's a live one!",ceil(shoot_frame_base.len/2)-ceil("BANG! It's a live one!".len/2),ceil(shoot_frame_base[0].len/2))
                else
                    if __ITEMS__.shoot_target=="Dealer" then
                        //Shoot Dealer with blank, no hp handling
                    else
                        dealer_turn=false
                    end if
                    shells.blank_num=shells.blank_num-1
                    draw_text(shoot_frame_sprite,"OOPS! It's a blank one!",ceil(shoot_frame_base.len/2)-ceil("OOPS! It's a blank one!".len/2),ceil(shoot_frame_base[0].len/2))
                end if
                shells.list.reverse
                shells.list.pop
                if shells.list.len then
                    shells.list.reverse
                    shells.current_shell=shells.list[0]
                end if
                shells.total_num=shells.total_num-1
                __ITEMS__.is_sawed=false
                if __ITEMS__.shoot_target=="Dealer" then
                    draw_rect(shoot_frame_sprite,ceil(shoot_frame_base.len/2)-ceil("Dealer".len/2)-1,2,"Dealer".len+2,3,false)
                else
                    draw_rect(shoot_frame_sprite,ceil(shoot_frame_base.len/2)-ceil(Your_name.len/2)-1,shoot_frame_base[0].len-5,Your_name.len+2,3,false)
                end if
                __FRAME__=put_frameA_on_B(shoot_frame_sprite,__FRAME__)
                render_frame(__FRAME__)
                wait(2)
                if __ITEMS__.Player.hp <=0 then
                    //TODO:Gameover handle
                    exit("Beter luck next time o7")
                end if
                if __ITEMS__.Dealer.hp <=0 then
                    //TODO:Phase handle
                    if __ITEMS__.phase_num%3==2 then
                        //TODO:Win handle
                        shoot_frame_sprite=init_frame([],29,35)
                        shoot_frame_sprite=put_frameA_on_B(shoot_frame_base,shoot_frame_sprite)
                        draw_text(shoot_frame_sprite,"                      ",ceil(shoot_frame_base.len/2)-ceil("BANG! It's a live one!".len/2),ceil(shoot_frame_base[0].len/2))
                        draw_text(shoot_frame_sprite,"Continue?",ceil(shoot_frame_base.len/2)-ceil("Continue?".len/2),ceil(shoot_frame_base[0].len/2))
                        __FRAME__=put_frameA_on_B(shoot_frame_sprite,__FRAME__)
                        render_frame(__FRAME__)
                        choice=user_input("y/N:")
                        if choice=="y" or choice=="Y" then
                            //double or nothing handle
                            new_phase(round(2+rnd*4))
                            shells=gen_shells(2+round(rnd*6))
                            break
                        else
                            //cash out handle
                            clear_screen
                            wait(0.5)
                            print "Congratulation!!! "+Your_name
                            wait(0.5)
                            print "You survived "+(__ITEMS__.phase_num+1)+" phases."
                            time_used=time-start_time
                            HH=time_used/60
                            ss=floor((HH-floor(HH))*60)
                            HH=floor(HH)
                            wait(0.5)
                            print "Time used: "+HH+":"+ss
                            wait(0.5)
                            print("Live shells fired: "+__ITEMS__.live_fired_num+" ("+__ITEMS__.shoot_self_num+" of them were fired at your own face. "+__ITEMS__.shoot_self_sawed_num+" of the "+__ITEMS__.shoot_self_num+" were sawed)")
                            if __ITEMS__.shoot_self_sawed_num!=0 then print("But why? Why would you shoot your self with a sawed gun")
                            wait(0.5)
                            print("You smoked "+__ITEMS__.used_cig_num+" cigarettes")
                            wait(0.5)
                            print("You drank "+__ITEMS__.used_beer_num+" cans of beer")
                            wait(0.5)
                            print("You see "+__ITEMS__.used_glas_live+" LIVE shells and "+__ITEMS__.used_glas_blank+" BLANK shells using magnifying glass")
                            wait(0.5)
                            print("You got shot by Dealer "+__ITEMS__.got_shot_by_dealer+" times. "+__ITEMS__.got_sawed_shot_by_dealer+" of them were sawed")
                            wait(0.5)
                            print("You witnessed the Dealer committed suicide "+__ITEMS__.dealer_shoot_self+" times")
                            wait(0.5)
                            print("\n\n")
                            wait(0.5)
                            user_input("press any key to exit.",false,true)
                            exit("See you next time o7")
                        end if
                    else
                        new_phase(round(2+rnd*4))
                        shells=gen_shells(2+round(rnd*6))
                        break
                    end if
                end if
                if shells.total_num==0 then
                    //TODO:new round handle
                    new_round()
                    shells=gen_shells(2+round(rnd*6))
                    break
                end if
                
                know_shell=false
                while dealer_turn or __ITEMS__.Player.is_cuffed       //dealer turn handle
                    if __ITEMS__.Dealer.is_cuffed then          //cuffed handle
                        if __ITEMS__.Dealer.cuffed_turn<1 then
                            __ITEMS__.Dealer.cuffed_turn=__ITEMS__.Dealer.cuffed_turn+1
                            break
                        else
                            __ITEMS__.Dealer.is_cuffed=false
                            __ITEMS__.Dealer.cuffed_turn=0
                        end if
                    end if
                    
                    dealer_turn=false
                    use_item=function(item_index)
                        item_frame_sprite=init_frame([],29,35)
                        item_frame_sprite=put_frameA_on_B(item_frame_base,item_frame_sprite)        //copy templates
                        _o=__ITEMS__.Dealer.items[item_index][1]
                        x=_o%4
                        y=floor(_o/4)
                        draw_rect(item_frame_sprite,x*7+1,y*7+1,6,6,false)
                        for i in range(0,7)                                             //draw items
                            o=__ITEMS__.Player.items[i][1]
                            _x=o%4
                            _y=floor(o/4)
                            text=__ITEMS__.Player.items[i][0]
                            if text!="empty" then draw_text(item_frame_sprite,text,2+_x*7,23+_y*7)
                            o=__ITEMS__.Dealer.items[i][1]
                            _x=o%4
                            _y=floor(o/4)
                            text=__ITEMS__.Dealer.items[i][0]
                            if text!="empty" then draw_text(item_frame_sprite,text,2+_x*7,3+_y*7)
                        end for
                        item=__ITEMS__.Dealer.items[item_index][0]
                        if item=="saw " then
                            if __ITEMS__.is_sawed then
                                return null       //skip
                            else
                                __ITEMS__.is_sawed=true
                            end if
                        end if
                        if item=="cig " then
                            if __ITEMS__.Dealer.hp+1<=__ITEMS__.Dealer.max_hp then
                                __ITEMS__.Dealer.hp=__ITEMS__.Dealer.hp+1
                            else
                                return null
                            end if
                        end if
                        if item=="beer" then
                            shells.list.reverse
                            shells.list.pop
                            if shells.list.len then
                                shells.list.reverse
                                shells.current_shell=shells.list[0]
                            end if
                            shells.total_num=shells.list.len
                            shells.live_num=shells.list.sum
                            shells.blank_num=shells.total_num-shells.live_num
                            if shells.total_num==0 then
                                //TODO:new round handle
                                new_round()
                                shells=gen_shells(2+round(rnd*6))
                                break
                            end if
                        end if
                        if item=="cuff" then
                            if __ITEMS__.Player.is_cuffed then
                                return null
                            else
                                __ITEMS__.Player.is_cuffed=true
                            end if
                        end if
                        if item=="glas" then
                            text="Very interesting..."
                            draw_text(item_frame_sprite,"              ",ceil(item_frame_base.len/2)-ceil("              ".len/2),17)
                            draw_text(item_frame_sprite,text,ceil(item_frame_base.len/2)-ceil(text.len/2),17)
                        end if
                        __ITEMS__.Dealer.items=__ITEMS__.Dealer.items[0:item_index]+__ITEMS__.Dealer.items[item_index+1:8]
                        __ITEMS__.Dealer.items.push(["empty",_o])

                        __FRAME__=put_frameA_on_B(item_frame_sprite,__FRAME__,0,0)
                        render_frame(__FRAME__)                                         //render the final frame
                        wait(2)
                        return null
                    end function

                    item_frame_sprite=init_frame([],29,35)                                      //init a new frame to render
                    stats_frame_sprite=init_frame([],12,35)
                    item_frame_sprite=put_frameA_on_B(item_frame_base,item_frame_sprite)        //copy templates
                    stats_frame_sprite=put_frameA_on_B(stats_frame_base,stats_frame_sprite)
                    for i in range(1,shells.live_num)                               //draw live shells
                        if shells.live_num!=0 then stats_frame_sprite[i+1][11]="<color=#ff0000>I</color>"
                    end for
                    for i in range(1,shells.blank_num)                              //draw blank shells
                        if shells.blank_num!=0 then stats_frame_sprite[i+1][12]="<color=#0000ff>I</color>"
                    end for
                    if cheat then
                        for i in range(0,shells.total_num-1)                            //CHEAT shells order
                            if shells.list.len then stats_frame_sprite[i+2][13]="<color=#ffff00>"+shells.list[i]+"</color>"
                        end for
                    end if
                    draw_text(stats_frame_sprite,str(__ITEMS__.Dealer.hp),5,4)
                    if __ITEMS__.Dealer.is_cuffed then draw_text(stats_frame_sprite,"Cuffed",2,5)
                    if __ITEMS__.is_sawed then draw_text(stats_frame_sprite,"sawed",2,20)
                    if __ITEMS__.Player.is_cuffed then draw_text(stats_frame_sprite,"Cuffed",2,31)
                    draw_text(stats_frame_sprite,str(__ITEMS__.Player.hp),5,32)
                    draw_text(stats_frame_sprite,str(__ITEMS__.phase_num%3+1),8,17)
                    draw_text(stats_frame_sprite,str(__ITEMS__.round_num),8,18)
                    item_frame_sprite=init_frame([],29,35)
                    item_frame_sprite=put_frameA_on_B(item_frame_base,item_frame_sprite)
                    for i in range(0,7)                                             //draw items
                        o=__ITEMS__.Player.items[i][1]
                        x=o%4
                        y=floor(o/4)
                        text=__ITEMS__.Player.items[i][0]
                        if text!="empty" then draw_text(item_frame_sprite,text,2+x*7,23+y*7)
                        o=__ITEMS__.Dealer.items[i][1]
                        x=o%4
                        y=floor(o/4)
                        text=__ITEMS__.Dealer.items[i][0]
                        if text!="empty" then draw_text(item_frame_sprite,text,2+x*7,3+y*7)
                    end for
                    __FRAME__=put_frameA_on_B(stats_frame_sprite,__FRAME__,32,0)
                    __FRAME__=put_frameA_on_B(item_frame_sprite,__FRAME__,0,0)
                    render_frame(__FRAME__)                                         //render the final frame
                    wait(1)
                    //Judge phase
                    used_items=[]
                    skip_item_phase=false
                    shoot_target=""
                    hit_chance=shells.live_num/shells.total_num
                    if hit_chance>=0.5 then
                        shoot_target="You"
                    else
                        shoot_target="Dealer"
                    end if
                    if shells.blank_num==0 then
                        skip_item_phase=true
                        shoot_target="You"
                        know_shell=true
                    end if
                    if shells.live_num==0 then
                        skip_item_phase=true
                        shoot_target="Dealer"
                        know_shell=true
                    end if
                    //Item phase
                    if __ITEMS__.Dealer.hp<__ITEMS__.Dealer.max_hp and has_item(__ITEMS__.Dealer.items,"cig ")!=null then       //Healing logic
                        use_item(has_item(__ITEMS__.Dealer.items,"cig "))
                        dealer_turn=true
                        continue
                    end if
                    if shoot_target=="You" and has_item(__ITEMS__.Dealer.items,"saw ")!=null and (not __ITEMS__.is_sawed) then  //sawing logic
                        use_item(has_item(__ITEMS__.Dealer.items,"saw "))
                        dealer_turn=true
                        continue
                    end if
                    if (not know_shell) and has_item(__ITEMS__.Dealer.items,"glas")!=null then      //glass logic
                        use_item(has_item(__ITEMS__.Dealer.items,"glas"))
                        know_shell=true
                        dealer_turn=true
                        continue
                    end if
                    if (not know_shell) and shells.total_num>=2 and has_item(__ITEMS__.Dealer.items,"beer")!=null and (not __ITEMS__.is_sawed) then  //beer logic
                        use_item(has_item(__ITEMS__.Dealer.items,"beer"))
                        dealer_turn=true
                        continue
                    end if
                    if shells.total_num>=2 and shells.live_num!=0 and has_item(__ITEMS__.Dealer.items,"cuff")!=null and (not __ITEMS__.Player.is_cuffed) then    //cuff logic
                        use_item(has_item(__ITEMS__.Dealer.items,"cuff"))
                        dealer_turn=true
                        continue
                    end if
                    //Shoot phase
                    if __ITEMS__.Player.is_cuffed and know_shell then
                        if shells.current_shell then
                            shoot_target=="You"
                        else
                            shoot_target=="Dealer"
                        end if
                    end if
                    shoot_frame_sprite=init_frame([],29,35)
                    shoot_frame_sprite=put_frameA_on_B(shoot_frame_base,shoot_frame_sprite)
                    if shoot_target=="Dealer" then
                        draw_rect(shoot_frame_sprite,ceil(shoot_frame_base.len/2)-ceil("Dealer".len/2)-1,2,"Dealer".len+2,3,false)
                    else
                        draw_rect(shoot_frame_sprite,ceil(shoot_frame_base.len/2)-ceil(Your_name.len/2)-1,shoot_frame_base[0].len-5,Your_name.len+2,3,false)
                    end if
                    __FRAME__=put_frameA_on_B(shoot_frame_sprite,__FRAME__)
                    render_frame(__FRAME__)
                    wait(1)
                    if shells.current_shell then
                        if shoot_target=="Dealer" then
                            __ITEMS__.dealer_shoot_self=__ITEMS__.dealer_shoot_self+1
                            __ITEMS__.Dealer.hp=__ITEMS__.Dealer.hp-1
                            if __ITEMS__.is_sawed then __ITEMS__.Dealer.hp=__ITEMS__.Dealer.hp-1
                        else
                            __ITEMS__.got_shot_by_dealer=__ITEMS__.got_shot_by_dealer+1
                            __ITEMS__.Player.hp=__ITEMS__.Player.hp-1
                            if __ITEMS__.is_sawed then 
                                __ITEMS__.Player.hp=__ITEMS__.Player.hp-1
                                __ITEMS__.got_sawed_shot_by_dealer=__ITEMS__.got_sawed_shot_by_dealer+1
                            end if
                        end if
                        if __ITEMS__.Player.is_cuffed then __ITEMS__.Player.cuffed_turn=__ITEMS__.Player.cuffed_turn+1
                        shells.live_num=shells.live_num-1
                        draw_text(shoot_frame_sprite,"BANG! It's a live one!",ceil(shoot_frame_base.len/2)-ceil("BANG! It's a live one!".len/2),ceil(shoot_frame_base[0].len/2))
                    else
                        if shoot_target=="Dealer" then 
                            dealer_turn=true
                        else
                            if __ITEMS__.Player.is_cuffed then __ITEMS__.Player.cuffed_turn=__ITEMS__.Player.cuffed_turn+1
                        end if
                        shells.blank_num=shells.blank_num-1
                        draw_text(shoot_frame_sprite,"OOPS! It's a blank one!",ceil(shoot_frame_base.len/2)-ceil("OOPS! It's a blank one!".len/2),ceil(shoot_frame_base[0].len/2))
                    end if
                    shells.list.reverse
                    shells.list.pop
                    if shells.list.len then
                        shells.list.reverse
                        shells.current_shell=shells.list[0]
                    end if
                    shells.total_num=shells.total_num-1
                    __ITEMS__.is_sawed=false
                    know_shell=false
                    if __ITEMS__.Player.is_cuffed then          //cuffed handle
                        if __ITEMS__.Player.cuffed_turn==2 then
                            __ITEMS__.Player.is_cuffed=false
                            __ITEMS__.Player.cuffed_turn=0
                        end if
                    end if

                    if shoot_target=="Dealer" then
                        draw_rect(shoot_frame_sprite,ceil(shoot_frame_base.len/2)-ceil("Dealer".len/2)-1,2,"Dealer".len+2,3,false)
                    else
                        draw_rect(shoot_frame_sprite,ceil(shoot_frame_base.len/2)-ceil(Your_name.len/2)-1,shoot_frame_base[0].len-5,Your_name.len+2,3,false)
                    end if
                    __FRAME__=put_frameA_on_B(shoot_frame_sprite,__FRAME__)
                    render_frame(__FRAME__)
                    wait(2)
                    if __ITEMS__.Player.hp <=0 then
                        //TODO:Gameover handle
                        exit("Beter luck next time o7")
                    end if
                    if __ITEMS__.Dealer.hp <=0 then
                        //TODO:Phase handle
                        if __ITEMS__.phase_num%3==2 then
                            //TODO:Win handle
                            shoot_frame_sprite=init_frame([],29,35)
                            shoot_frame_sprite=put_frameA_on_B(shoot_frame_base,shoot_frame_sprite)
                            draw_text(shoot_frame_sprite,"                      ",ceil(shoot_frame_base.len/2)-ceil("BANG! It's a live one!".len/2),ceil(shoot_frame_base[0].len/2))
                            draw_text(shoot_frame_sprite,"Continue?",ceil(shoot_frame_base.len/2)-ceil("Continue?".len/2),ceil(shoot_frame_base[0].len/2))
                            __FRAME__=put_frameA_on_B(shoot_frame_sprite,__FRAME__)
                            render_frame(__FRAME__)
                            choice=user_input("y/N:")
                            if choice=="y" or choice=="Y" then
                                //double or nothing handle
                                new_phase(round(2+rnd*4))
                                shells=gen_shells(2+round(rnd*6))
                                break
                            else
                                //cash out handle
                                clear_screen
                                wait(0.5)
                                print "Congratulation!!! "+Your_name
                                wait(0.5)
                                print "You survived "+(__ITEMS__.phase_num+1)+" phases."
                                time_used=time-start_time
                                HH=time_used/60
                                ss=floor((HH-floor(HH))*60)
                                HH=floor(HH)
                                wait(0.5)
                                print "Time used: "+HH+":"+ss
                                wait(0.5)
                                print("Live shells fired: "+__ITEMS__.live_fired_num+" ("+__ITEMS__.shoot_self_num+" of them were fired at your own face. "+__ITEMS__.shoot_self_sawed_num+" of the "+__ITEMS__.shoot_self_num+" were sawed)")
                                if __ITEMS__.shoot_self_sawed_num!=0 then print("But why? Why would you shoot your self with a sawed gun")
                                wait(0.5)
                                print("You smoked "+__ITEMS__.used_cig_num+" cigarettes")
                                wait(0.5)
                                print("You drank "+__ITEMS__.used_beer_num+" cans of beer")
                                wait(0.5)
                                print("You see "+__ITEMS__.used_glas_live+" LIVE shells and "+__ITEMS__.used_glas_blank+" BLANK shells using magnifying glass")
                                wait(0.5)
                                print("You got shot by Dealer "+__ITEMS__.got_shot_by_dealer+" times. "+__ITEMS__.got_sawed_shot_by_dealer+" of them were sawed")
                                wait(0.5)
                                print("You witnessed the Dealer committed suicide "+__ITEMS__.dealer_shoot_self+" times")
                                wait(0.5)
                                print("\n\n")
                                wait(0.5)
                                user_input("press any key to exit.",false,true)
                                exit("See you next time o7")
                            end if
                        else
                            new_phase(round(2+rnd*4))
                            shells=gen_shells(2+round(rnd*6))
                            break
                        end if
                    end if
                    if shells.total_num==0 then
                        //TODO:new round handle
                        new_round()
                        shells=gen_shells(2+round(rnd*6))
                        break
                    end if
                end while
                break
            end if
            shoot_frame_sprite=init_frame([],29,35)
            shoot_frame_sprite=put_frameA_on_B(shoot_frame_base,shoot_frame_sprite)
            if __ITEMS__.shoot_target=="Dealer" then
                draw_rect(shoot_frame_sprite,ceil(shoot_frame_base.len/2)-ceil("Dealer".len/2)-1,2,"Dealer".len+2,3,false)
            else
                draw_rect(shoot_frame_sprite,ceil(shoot_frame_base.len/2)-ceil(Your_name.len/2)-1,shoot_frame_base[0].len-5,Your_name.len+2,3,false)
            end if

            __FRAME__=put_frameA_on_B(shoot_frame_sprite,__FRAME__)
            render_frame(__FRAME__)
        end while
    end if
    if key=="e" and __ITEMS__.item_cursor.y!=0 then
        //TODO:use item handle
        index=(__ITEMS__.item_cursor.y-1)*4+__ITEMS__.item_cursor.x     //i=y*4+x
        item=""
        for i in range(0,7)
            if __ITEMS__.Player.items[i][1]==index then 
                item=__ITEMS__.Player.items[i][0]
                index=i
                break
            end if
        end for
        if item=="saw " then
            if __ITEMS__.is_sawed then
                continue       //skip
            else
                __ITEMS__.is_sawed=true
            end if
        end if
        if item=="cig " then
            if __ITEMS__.Player.hp+1<=__ITEMS__.Player.max_hp then
                __ITEMS__.used_cig_num=__ITEMS__.used_cig_num+1
                __ITEMS__.Player.hp=__ITEMS__.Player.hp+1
            else
                continue
            end if
        end if
        if item=="beer" then
            __ITEMS__.used_beer_num=__ITEMS__.used_beer_num+1
            shells.list.reverse
            shells.list.pop
            if shells.list.len then
                shells.list.reverse
                shells.current_shell=shells.list[0]
            end if
            shells.total_num=shells.list.len
            shells.live_num=shells.list.sum
            shells.blank_num=shells.total_num-shells.live_num
            if shells.total_num==0 then
                //TODO:new round handle
                new_round()
                shells=gen_shells(2+round(rnd*6))
            end if
        end if
        if item=="cuff" then
            if __ITEMS__.Dealer.is_cuffed then
                continue
            else
                __ITEMS__.Dealer.is_cuffed=true
            end if
        end if
        if item=="glas" then
            text=""
            if shells.current_shell then
                text="You see a LIVE shell"
                __ITEMS__.used_glas_live=__ITEMS__.used_glas_live+1
            else
                text="You see a BLANK shell"
                __ITEMS__.used_glas_blank=__ITEMS__.used_glas_blank+1
            end if
            item_frame_sprite=init_frame([],29,35)
            item_frame_sprite=put_frameA_on_B(item_frame_base,item_frame_sprite)        //copy templates
            draw_text(item_frame_sprite,"              ",ceil(item_frame_base.len/2)-ceil("              ".len/2),17)
            draw_text(item_frame_sprite,text,ceil(item_frame_base.len/2)-ceil(text.len/2),17)
            if __ITEMS__.item_cursor.y<1 then                               //draw cursor
                draw_rect(item_frame_sprite,1,15,27,5,false)
            else
                draw_rect(item_frame_sprite,__ITEMS__.item_cursor.x*7+1,13+__ITEMS__.item_cursor.y*7+1,6,6,false)
            end if
            for i in range(0,7)                                             //draw items
                o=__ITEMS__.Player.items[i][1]
                x=o%4
                y=floor(o/4)
                text=__ITEMS__.Player.items[i][0]
                if text!="empty" then draw_text(item_frame_sprite,text,2+x*7,23+y*7)
                o=__ITEMS__.Dealer.items[i][1]
                x=o%4
                y=floor(o/4)
                text=__ITEMS__.Dealer.items[i][0]
                if text!="empty" then draw_text(item_frame_sprite,text,2+x*7,3+y*7)
            end for
            __FRAME__=put_frameA_on_B(item_frame_sprite,__FRAME__,0,0)
            render_frame(__FRAME__)                                         //render the final frame
            wait(2)
        end if
        temp=__ITEMS__.Player.items[index][1]
        __ITEMS__.Player.items=__ITEMS__.Player.items[0:index]+__ITEMS__.Player.items[index+1:8]
        __ITEMS__.Player.items.push(["empty",temp])
    end if

    item_frame_sprite=init_frame([],29,35)                                      //init a new frame to render
    stats_frame_sprite=init_frame([],12,35)
    item_frame_sprite=put_frameA_on_B(item_frame_base,item_frame_sprite)        //copy templates
    stats_frame_sprite=put_frameA_on_B(stats_frame_base,stats_frame_sprite)
    for i in range(1,shells.live_num)                               //draw live shells
        if shells.live_num!=0 then stats_frame_sprite[i+1][11]="<color=#ff0000>I</color>"
    end for
    for i in range(1,shells.blank_num)                              //draw blank shells
        if shells.blank_num!=0 then stats_frame_sprite[i+1][12]="<color=#0000ff>I</color>"
    end for
    if cheat then
        for i in range(0,shells.total_num-1)                            //CHEAT shells order
            if shells.list.len then stats_frame_sprite[i+2][13]="<color=#ffff00>"+shells.list[i]+"</color>"
        end for
    end if
    draw_text(stats_frame_sprite,str(__ITEMS__.Dealer.hp),5,4)
    if __ITEMS__.Dealer.is_cuffed then draw_text(stats_frame_sprite,"Cuffed",2,5)
    if __ITEMS__.is_sawed then draw_text(stats_frame_sprite,"sawed",2,20)
    if __ITEMS__.Player.is_cuffed then draw_text(stats_frame_sprite,"Cuffed",2,31)
    draw_text(stats_frame_sprite,str(__ITEMS__.Player.hp),5,32)
    draw_text(stats_frame_sprite,str(__ITEMS__.phase_num%3+1),8,17)
    draw_text(stats_frame_sprite,str(__ITEMS__.round_num),8,18)
    if __ITEMS__.item_cursor.y<1 then                               //draw cursor
        draw_rect(item_frame_sprite,1,15,27,5,false)
    else
        draw_rect(item_frame_sprite,__ITEMS__.item_cursor.x*7+1,13+__ITEMS__.item_cursor.y*7+1,6,6,false)
    end if
    for i in range(0,7)                                             //draw items
        o=__ITEMS__.Player.items[i][1]
        x=o%4
        y=floor(o/4)
        text=__ITEMS__.Player.items[i][0]
        if text!="empty" then draw_text(item_frame_sprite,text,2+x*7,23+y*7)
        o=__ITEMS__.Dealer.items[i][1]
        x=o%4
        y=floor(o/4)
        text=__ITEMS__.Dealer.items[i][0]
        if text!="empty" then draw_text(item_frame_sprite,text,2+x*7,3+y*7)
    end for
    __FRAME__=put_frameA_on_B(stats_frame_sprite,__FRAME__,32,0)
    __FRAME__=put_frameA_on_B(item_frame_sprite,__FRAME__,0,0)
    render_frame(__FRAME__)                                         //render the final frame

end while
