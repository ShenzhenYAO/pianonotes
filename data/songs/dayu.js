const dayu = {
    signature: { tempo: 96 }, //76
    notes: [
        {
            clef: 'treble',
            text: `
        [1]
            4.5,0.5,b
            4,b
            4.5,b
            6,b            
            4.5,b
            4,b
            4.5,b
            6.5,b

            4.5,b
            4,b
            4.5,b
            7,b
            6.5,1
            5.5

            4.5,0.5,b
            4,b
            4.5,b
            6,b            
            4.5,b
            4,b
            4.5,b
            6.5,b

            5.5,1
            3.5
            3,2
        
        [5]
            4.5,0.5,b
            4,b
            4.5,b
            6,b            
            4.5,b
            4,b
            4.5,b
            6.5,b

            4.5,b
            4,b
            4.5,b
            7,b
            6.5,1
            5.5

            4,.5,b
            4.5,b
            2.5,1
            4,.5,b
            4.5,b
            2.5,b
            2,b

            2.5,4

        [9]
            2.5, .5, b
            3.5,b
            3.5,b
            4,b
            4,b
            4.5,b
            4.5,b,
            6,b
            
            5.5,1.5
            4.5,.5
            4,2

            2.5,.5,b
            3.5,b
            3.5,b
            4,b
            4,b
            4.5,b
            4.5,1

            2.5,1
            2,3
        [13]
        2.5, .5, b
        3.5,b
        3.5,b
        4,b
        4,b
        4.5,b
        4.5,b,
        6,b
        
        5.5,1.5
        4.5,.5
        4,2

        4,.5,b
        4.5,b
        2.5,1
        4,.5,b
        4.5,b
        2.5,b
        2,b

        2.5,3
        2.5,.5,b
        3.5,b
    [17]
        4, 1.5
        3.5,.5
        2.5,1
        2.5,.5,b
        3.5,b

        4,1.5
        3.5,.5
        4.5,1
        4.5,.5
        5.5

        6,1
        6,.5,b
        5.5,b
        4.5,b
        4,b
        3.5,1

        4,.5
        4.5,1.5
        m,1
        2.5,.5,b
        3.5,b
    [21]
        4,1.5
        3.5,.5
        2.5,1
        2.5,.5
        3.5,.5

        4,1
        3.5,1
        4.5,2

        4,.5,b
        4.5,b
        2.5,1
        4,.5,b
        4.5,b
        2.5,b
        2,b

        2.5,3
        4.5,.5,b
        5.5,b
    [25]
        4.5,1.5;7
        4,.5;6.5
        2,1;4.5
        4.5,.5,b
        4,b

        3.5,1
        3.5,.5,b
        4,b
        4.5,1
        4.5,.5,b
        4,b

        3.5,1
        3.5,.5,b;6,b
        4.5,b;7,b
        4,b;6.5,b
        3.5,b;6,b
        3,b;5.5,b
        2,b;4,b

        2,3;4.5
        4.5,.5,b
        5.5,b
    [29]
        4.5,1.5;7
        4,.5;6.5
        2,1;4.5
        4.5,.5,b
        4,b

        3.5,1
        4,
        4.5,2

        4,.5,b
        4.5,b
        2.5,1
        4,.5,b
        4.5,b
        2.5,b
        2,b

        2.5,4
        
            `
        },
        {
            clef: 'bass',
            text: `
        [1]
            4,2;6
            4.5;6.5

            5,4;7

            4,2;6
            4.5;6.5

            5,4;7
        
        [5]
            4,2;6
            4.5;6.5

            5,4;7

            3,.5,b
            5,b
            6.5,1
            3.5,.5,b
            5.5,b
            6.5,1

            1.5,.5,b
            3.5,b
            6.5,1
            6s,2

        [9]
            0.5, 0.5,b
            2.5,b
            5,3

            0,.5,b
            2,b
            4.5,3

            0.5, 0.5,b
            2.5,b
            5,3

            0,.5,b
            3,b
            4.5,3
        [13]
            0.5, 0.5,b
            2.5,b
            5,3

            0,.5,b
            2,b
            4.5,3

            3,2;4;5;6
            3.5;4.5;5.5;6
            
            1.5,.5,b
            3.5,b
            6.5,b
            3.5,b
            6,1
            5.5
        [17]
            0.5,.5,b
            2.5,b
            5,1
            1,.5,b
            3,b
            5.5,1

            1.5,.5,b
            2.5,b
            6,1
            1,.5,b
            3.5,b
            5.5,1

            0.5,.5,b
            2.5,b
            5,1
            1,.5,b
            3,b
            5.5,1

            2.5,.5,b
            4.5,b
            7.5,b
            4.5,b
            7,2
        [21]
            2,.5,b
            4,b
            6.5,1
            0,.5,b
            3.5,b
            6.5,1

            1.5,.5,b
            3.5,b
            1,b
            3.5,b
            0.5s,2

            -0.5,.5,b
            3,b
            6,1
            0,.5,b
            3,b
            5.5,1

            1.5,.5,b
            3.5,b
            6.5,b
            3.5,b
            6,,b
            3.5,b
            5.5,b
            3.5,b
        [25]
            0.5,.5,b
            2.5,b
            5,b
            2.5,b
            1,b
            3,b
            5.5,b
            3,b

            1.5,b
            3.5,b
            6,b
            3.5,b
            1,b
            3.5,b
            5.5,b
            3.5,b

            .5,b
            2.5,b
            5,b
            2.5,b
            1,b
            3,b
            5.5,1

            2.5,.5,b
            4.5,b
            7,b
            4.5,b
            0,b
            2,b
            3.5,b
            4.5,b
        [29]
            0.5,.5,b
            2.5,b
            5,b
            2.5,b
            1,b
            3,b
            5.5,b
            3,b

            1.5,1;5
            1;4.5
            0.5s,2;4s

            -0.5,.5,b
            1.5,b
            4,1
            0,.5,b
            2,b
            4.5,1

            1.5,.5,b
            3.5,b
            5,b
            6,b
            7,2


            `
        }
    ]
}