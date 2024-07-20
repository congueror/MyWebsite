function arcsinGraphOptions() {
    return {
        axes: "manual",
        xIncrement: 1,
        yIncrement: 1,
        maxX: 2,
        maxY: 2,
        minX: -2,
        minY: -2,
        dataset: [
            {
                type: "function",
                color: "#767eff",
                domain: `[${-Math.PI / 2},${Math.PI / 2}]`,
                fun: Math.sin
            },
            {
                type: "function",
                color: "#56ff56",
                domain: `[${-1},${1}]`,
                fun: Math.asin
            },
        ]
    };
}

function arccosGraphOptions() {
    return {
        axes: "manual",
        xIncrement: 1,
        yIncrement: 1,
        maxX: 4,
        maxY: 4,
        minX: -4,
        minY: -4,
        dataset: [
            {
                type: "function",
                color: "#767eff",
                domain: `[${0},${Math.PI}]`,
                fun: Math.cos
            },
            {
                type: "function",
                color: "#56ff56",
                domain: `[${-1},${1}]`,
                fun: Math.acos
            },
        ]
    };
}

function cubedGraphOptions() {
    return {
        axes: "manual",
        xIncrement: 1,
        yIncrement: 1,
        maxX: 4,
        maxY: 4,
        minX: -4,
        minY: -2,
        dataset: [
            {
                type: "data",
                color: "#0090de",
                interpolation: "polynomial",
                x: [-3, -2, -1, 0, 1, 2, 3],
                y: [0, 3, 3, 1.5, 0, 0, 3],
                customDomain: true,
                domain: `(${-3.35},${4})`
            }
        ]
    };
}

const DATA = {
    en_us: [
        {
            id: "calculus_1",
            title: "Calculus I",
            subunits: [
                {
                    id: "even_odd_functions",
                    title: "Even and Odd Functions",
                    definition: `A function \\(f:A\\to B\\) is even if for every \\(x\\in A\\) it is true that: \\(-x\\in A\\) and \\(f(-x)=f(x)\\) <br>
                    A function \\(f:A\\to B\\) is odd if for every \\(x\\in A\\) it is true that: \\(-x\\in A\\) and \\(f(-x)=-f(x)\\)`,
                    problems: [
                        {
                            passage: `Determine if the function is even, odd or neither: \\[ f(x)=\\frac{5}{3-x^4} \\]`,
                            solution: `Function has domain \\(Δ= \\mathbb{R}-\\{\\pm\\sqrt[4]{3}\\} \\) and, 
                            \\[ f(-x)=\\frac{5}{3-(-x)^4}=\\frac{5}{3-x^4}=f(x) \\] So it is true that for every \\( x\\in Δ \\) 
                            and there exists \\( -x\\in Δ\\) and \\( f(-x)=f(x) \\), hence the function is even.`,
                            tags: ["even_odd"]
                        },
                        {
                            passage: `Determine if the function is even, odd or neither: \\[ f(x)=\\frac{1}{x}+\\sqrt[3]{x} \\]`,
                            solution: `Function has domain \\(Δ= \\mathbb{R}_{>0} \\) which does not contain negative numbers, hence it can be neither even nor odd.`,
                            tags: ["even_odd"]
                        },
                        {
                            passage: `Determine if the function is even, odd or neither: \\[ f(x)=2^x+2^{-x} \\]`,
                            solution: `Function has domain \\(Δ= \\mathbb{R} \\) and, 
                            \\[ f(-x)=2^{-x}+2^{-(-x)}=2^{-x}+2^x=f(x) \\] So it is true that for every \\( x\\in Δ \\) 
                            and there exists \\( -x\\in Δ\\) and \\( f(-x)=f(x) \\), hence the function is even.`,
                            tags: ["even_odd"]
                        },
                        {
                            passage: `Determine if the function is even, odd or neither: \\[ f(x)=\\frac{x}{1-x} \\]`,
                            solution: `Function has domain \\(Δ= \\mathbb{R}-\\{1\\} \\) which means that for \\(x=-1, x=1\\notin Δ\\), hence it can be neither even nor odd.`,
                            tags: ["even_odd"]
                        },
                        {
                            passage: `Determine if the function is even, odd or neither: \\[ f(x)=X^3-4x \\]`,
                            solution: `Function has domain \\(Δ= \\mathbb{R} \\) and, 
                            \\[ f(-x)=-x^3+4x=-f(x) \\] So it is true that for every \\( x\\in Δ \\) 
                            and there exists \\( -x\\in Δ\\) and \\( f(-x)=-f(x) \\), hence the function is odd.`,
                            tags: ["even_odd"]
                        },
                    ]
                },
                {
                    id: "differential",
                    title: "Differential of Function",
                    definition: `The differential \\( dy \\) (or \\( df \\)) of a differentiable function \\( y=f(x) \\) 
                    is the linear approximation of the difference \\( Δy \\), as \\( Δx\\to0 \\) and it is equal to: 
                    \\[ dy=f'(x)\\cdot dx \\]
                    The differential also has the following properties: <br> <ul>
                    <li>\\( dx=d(x+a), \\forall a\\in\\mathbb{R} \\)</li>
                    <li>\\( dx=\\frac{1}{λ}d(λx)=λd(\\frac{x}{λ}) \\)</li>
                    </ul>`,
                    problems: [
                        {
                            passage: `Find the differential of the following functions: <br> <ol type="a">
                            <li>\\( y=\\cos(3x) \\)</li>
                            <li>\\( u=e^{2t}-t \\)</li>
                            <li>\\( w=\\ln v \\)</li>
                            </ol>`,
                            solution: `<ol type="a">
                            <li>\\( y=\\cos(3x) \\Rightarrow dy=-3\\sin(3x)dx \\)</li>
                            <li>\\( u=e^{2t}-t \\Rightarrow du=(2e^{2t}-1)dt \\)</li>
                            <li>\\( w=\\ln v \\Rightarrow dw=\\frac{1}{v}dv \\)</li>
                            </ol>`,
                            tags: ["derivative"]
                        },
                        {
                            passage: `Find the differential of the following functions: <br> <ol type="a">
                            <li>\\( f(x)=3x^2-5x+1 \\)</li>
                            <li>\\( g(x)=\\ln(x+2) \\)</li>
                            <li>\\( h(x)=\\sqrt{x^2+1} \\)</li>
                            <li>\\( k(x)=(7-2x^3)^4 \\)</li>
                            </ol>`,
                            solution: `<ol type="a">
                            <li>\\( f(x)=3x^2-5x+1 \\Rightarrow df=(6x-5)dx \\)</li>
                            <li>\\( g(x)=\\ln(x+2) \\Rightarrow dg=\\frac{dx}{x+2}\\)</li>
                            <li>\\( h(x)=\\sqrt{x^2+1} \\Rightarrow dh=\\frac{2xdx}{2\\sqrt{x^2+1}}\\)</li>
                            <li>\\( k(x)=(7-2x^3)^4 \\Rightarrow dk=4(-6x^2)(7-2x^3)^3dx\\)</li>
                            </ol>`,
                            tags: ["derivative"]
                        }
                    ]
                },
                {
                    id: "indefinite_integral",
                    title: "Indefinite Integral",
                    definition: `Let \\(f\\) be a function defined in the range \\( Δ\\subseteq\\mathbb{R}\\). Antiderivative of \\(f\\) is any function \\(F\\) which is
                    differentiable at \\(Δ\\) and for which it applies that \\( F'(x)=f(x), \\forall x\\in Δ \\). <br>
                    Hence, the total of all antiderivatives of function \\(f\\) in the range \\( Δ\\subseteq\\mathbb{R}\\) is called the <u>indefinite integral</u>
                    of \\(f\\) in \\(Δ\\) and it is symbolized with:
                    \\[ \\int f(x)dx \\] That is to say, if \\(F\\) is an antiderivative of \\(f\\) in \\(Δ\\), then:
                    \\[ \\int f(x)dx = F(x)+c,c\\in\\mathbb{R} \\] <br>
                    Notes: <ul>
                    <li>If, \\(f=g\\), then, \\( \\int f(x)dx = \\int g(x)dx \\)</li>
                    <li>If \\(f\\) is continuous, then, \\( \\frac{d}{dx}(\\int f(x)dx)=f(x) \\)</li>
                    <li>If \\(f\\) is differentiable, then, \\( \\int \\frac{d}{dx}(f(x))dx=f(x)+c,\\ c\\in\\mathbb{R} \\)</li>
                    </ul><br>
                    Properties: <br><ul>
                    <li>\\( \\int af(x)dx=a\\int f(x)dx, a\\in \\mathbb{R} \\)</li>
                    <li>\\( \\int (f(x)\\pm g(x))dx=\\int f(x)dx \\pm \\int g(x)dx \\)</li>
                    </ul>`,
                    subunits: [
                        {
                            id: "solving_indefinite_integrals",
                            title: "Solving Integrals",
                            definition: `Basic Indefinite Integrals: <br> <ul style="columns: 2">
                            <li>\\( \\int adx=ax+c, a\\in \\mathbb{R} \\)</li>
                            <li>\\( \\int f(ax+b)dx=\\frac{1}{a}F(ax+b)+c \\)</li>
                            <li>\\( \\int x^ndx=\\frac{x^{n+1}}{n+1}+c, \\forall n\\in\\mathbb{R}-\\{-1\\} \\)</li>
                            <li>\\( \\int f^n(x)f'(x)dx= \\int f^n(x)d(f(x))=\\frac{f^{n+1}(x)}{n+1}+c \\)</li>
                            <li>\\( \\int \\frac{1}{x}dx=\\ln |x|+c \\)</li>
                            <li>\\( \\int \\frac{f'(x)}{f(x)}dx=\\ln |f(x)|+c \\)</li>
                            <li>\\( \\int e^xdx=e^x+c \\)</li>
                            <li>\\( \\int a^xdx=\\frac{a^x}{\\ln a}+c, \\forall a\\in\\mathbb{R}^+-\\{1\\} \\)</li>
                            <li>\\( \\int \\sin xdx=-\\cos x+c \\)</li>
                            <li>\\( \\int \\cos xdx=\\sin x+c \\)</li>
                            <li>\\( \\int \\sec^2 xdx=\\tan x+c \\)</li>
                            <li>\\( \\int \\csc^2 xdx=-\\cot x+c \\)</li>
                            <li>\\( \\int \\sec x\\tan xdx=\\sec x+c \\)</li>
                            <li>\\( \\int \\csc x\\cot xdx=-\\csc x+c \\)</li>
                            <li>\\( \\int \\frac{1}{\\sqrt{1-x^2}}dx=\\arcsin x+c \\)</li>
                            <li>\\( \\int \\frac{1}{1+x^2}dx=\\arctan x+c \\)</li>
                            </ul><br>
                            Integration with Replacement: <br>
                            Let continuous function \\(f\\) with antiderivative \\(F\\) in space \\(Δ\\) and differentiable function \\(u=g(x)\\). Then:
                            \\[ \\int f(g(x))g'(x)dx=\\int f(g(x))d(g(x))=\\int f(u)du=F(u)+c \\]<br>
                            Integration by parts: <br>
                            Let functions \\( f \\) and \\( g \\) have continuous derivatives \\(f'\\), \\(g'\\) in space \\(Δ\\), then it is true that:
                            \\[ \\int f(x)g'(x)dx=\\int f(x)d(g(x))=f(x)g(x)-\\int f'(x)g(x)dx \\]
                            `,
                            problems: [
                                {
                                    passage: `Prove that: \\( \\int f(x)g'(x)dx=f(x)g(x)-\\int f'(x)g(x)dx \\)`,
                                    solution: `We know that: \\[ \\frac{d}{dx}(f(x)g(x))=f'(x)g(x)+f(x)g'(x) \\] So if we integrate both sides:
                                    \\[ \\int \\frac{d}{dx}(f(x)g(x))dx=\\int f'(x)g(x)dx + \\int f(x)g'(x)dx \\]
                                    \\[ \\implies \\int f(x)g'(x)dx=f(x)g(x)-\\int f'(x)g(x)dx\\]`,
                                    tags: ["integral"]
                                },
                                {
                                    passage: `Solve the integral: \\( \\int x\\sin(x)dx \\)`,
                                    solution: `\\[ \\int x\\sin(x)dx=\\int xd(-\\cos(x))=-x\\cos(x)-\\int -\\cos(x)dx=-x\\cos(x)+\\sin(x)+c \\]`,
                                    tags: ["integral"]
                                },
                                {
                                    passage: `Solve the integral: \\( \\int e^x\\sin(x)dx \\)`,
                                    solution: `\\[ 
                                    \\begin{aligned}
                                      \\int e^x\\sin(x)dx & = \\int e^xd(-\\cos(x))\\\\
                                        & = -e^x\\cos(x)-\\int-\\cos(x)e^xdx\\\\
                                        & = -e^x\\cos(x)+\\int e^xd(\\sin(x))\\\\
                                        & = -e^x\\cos(x)+e^x\\sin(x)-\\int e^x\\sin(x)dx \\\\
                                    \\end{aligned}
                                    \\]
                                    Let \\( I=\\int e^x\\sin(x)dx \\)
                                    \\[ I=-e^x\\cos(x)+e^x\\sin(x)-I \\implies I+I=-e^x\\cos(x)+e^x\\sin(x) \\implies I=\\frac{-e^x\\cos(x)+e^x\\sin(x)}{2}+c \\]
                                    \\[ \\int e^x\\sin(x)dx=-\\frac{1}{2}e^x\\cos(x)+\\frac{1}{2}e^x\\sin(x)+c \\]
                                    `,
                                    tags: ["integral"]
                                }
                            ]
                        }
                    ],
                    problems: [
                        {
                            passage: `Find the indefinite integral: \\[ \\int 4x^3dx \\]`,
                            solution: `We have: \\( 4x^3=(x^4)', \\forall x\\in\\mathbb{R} \\). So, all antiderivatives of \\(f(x)=4x^3\\)
                            are of form \\( F(x)=x^4+c \\), Hence: \\[ \\int 4x^3dx = x^4+c \\]`,
                            tags: ["integral"]
                        },
                        {
                            passage: `Find the indefinite integral: \\[ \\int \\sin(3t)dt \\]`,
                            solution: `\\[ \\int \\sin(3t)dt = -\\frac{\\cos(3t)}{3}+c \\]`,
                            tags: ["integral"]
                        },
                        {
                            passage: `Given the graph of \\(f\\):<br> <div id="cubedGraph" class="make_graph" options="cubedGraphOptions" size=300></div><br>
                            If it is true that: \\[ \\int f(x)dx=F(x)+c \\] find for which values of \\(x\\) the function \\(F\\) has local maxima or minima`,
                            solution: `To find the local maxima and minima of a function we need to solve its derivative for zero:
                            \\[ \\frac{d}{dx}F(x)=0\\implies \\frac{d}{dx}\\int f(x)dx=0 \\implies f(x)=0 \\] So, using the graph we can find that the function f is zero at \\(x=1, x=2, x=-3\\).
                            So the function \\( F \\) has 3 local maxima/minima at \\( x=1,x=2,x=-3 \\)`,
                            tags: ["integral"]
                        },
                        {
                            passage: `Find the indefinite integral: \\[ \\int 6(2x+1)^2dx \\]`,
                            solution: `\\[ \\int 6(2x+1)^2dx=6\\int (2x+1)^2dx=6\\frac{1}{3\\cdot 2}(2x+1)^3+c=(2x+1)^3+c \\]`,
                            tags: ["integral"]
                        },
                        {
                            passage: `Find the indefinite integral: \\[ \\int x\\sin xdx \\]`,
                            solution: `\\[ \\int x\\sin xdx= \\int xd(-\\cos x)=-x\\cos x - \\int -\\cos xdx=\\sin x - x\\cos x + c \\]`,
                            tags: ["integral"]
                        },
                        {
                            passage: `Find the indefinite integral: \\[ \\int 2xdx \\]`,
                            solution: `\\[ \\int 2xdx=x^2+c \\]`,
                            tags: ["integral"]
                        },
                        {
                            passage: `Find the indefinite integral: \\[ \\int 4x^4dx \\]`,
                            solution: `\\[ \\int 4x^4dx=\\frac{4}{5}x^5+c \\]`,
                            tags: ["integral"]
                        },
                        {
                            passage: `Find the indefinite integral: \\[ \\int e^xdx \\]`,
                            solution: `\\[ \\int e^xdx=e^x+c \\]`,
                            tags: ["integral"]
                        },
                        {
                            passage: `Find the indefinite integral: \\[ \\int \\cos x dx\\]`,
                            solution: `\\[ \\int \\cos x=\\sin x + c \\]`,
                            tags: ["integral"]
                        },
                        {
                            passage: `Find the indefinite integral: \\[ \\int (\\sin x + \\cos x)^2dx \\]`,
                            solution: `\\[ \\int (\\sin x + \\cos x)^2dx=\\int (\\sin^2 x + \\cos^2 x + 2\\sin x\\cos x)dx=\\int 2\\sin x\\cos x dx=\\int \\sin(2x)dx=-\\frac{1}{2}\\cos(2x)+c \\]`,
                            tags: ["integral"]
                        }
                    ]
                }
            ]
        },
        {
            id: "application_diff_calculus",
            title: "Applications of Differential Calculus",
            subunits: [
                {
                    id: "de_l_hospital",
                    title: "Rule of De L' Hospital",
                    definition: `If \\[ \\lim_{x\\to x_0}f(x)=0, \\lim_{x\\to x_0}g(x)=0\\] or \\[ \\lim_{x\\to x_0}f(x)=\\pm\\infty, \\lim_{x\\to x_0}g(x)=\\pm\\infty\\] \\[ x_0 \\in\\mathbb{R}\\cup\\{-\\infty,+\\infty\\} \\]
                    And there exists \\[ \\lim_{x\\to x_0}\\frac{f'(x)}{g'(x)} \\]
                    Then: \\[ \\lim_{x\\to x_0}\\frac{f(x)}{g(x)}=\\lim_{x\\to x_0}\\frac{f'(x)}{g'(x)} \\]`,
                    problems: [
                        {
                            passage: "Calculate the limit: \\[ \\lim_{x\\to 2}\\frac{x^2 - 4}{x-2} \\]",
                            solution: `We have: \\[ \\lim_{x\\to2}(x^2-4)=0, \\lim_{x\\to2}(x-2)=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to2}\\frac{(x^2-4)'}{(x-2)'}=\\lim_{x\\to2}\\frac{2x}{1}=2\\cdot2=4 \\]
Therefore, it applies that:
\\[ \\lim_{x\\to2}\\frac{x^2-4}{x-2}=4 \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to 0}\\frac{\\ln(x+1)}{x} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to0}(\\ln(x+1))=0, \\lim_{x\\to0}(x)=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(\\ln(x+1))'}{x'}=\\lim_{x\\to0}\\frac{\\frac{1}{x+1}}{1}=\\frac{1}{1}=1 \\]
Therefore, it applies that:
\\[ \\lim_{x\\to 0}\\frac{\\ln(x+1)}{x}=1 \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to0}\\frac{e^x-1-x}{x^2} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to0}(e^x-1-x)=0,\\lim_{x\\to0}x^2=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(e^x-1-x)'}{(x^2)'}=\\lim_{x\\to0}\\frac{e^x-1}{2x} \\]
But, \\[ \\lim_{x\\to0}(e^x-1)=0,\\lim_{x\\to0}2x=0 \\]
So, we once again have the indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(e^x-1-x)''}{(x^2)''}=\\lim_{x\\to0}\\frac{e^x}{2}=\\frac{1}{2} \\]
Therefore, it applies that:
\\[ \\lim_{x\\to0}\\frac{e^x-1-x}{x^2}=\\frac{1}{2} \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to+\\infty}\\frac{e^x}{\\ln(x)} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to+\\infty}(e^x)=+\\infty,\\lim_{x\\to+\\infty}\\ln(x)=+\\infty \\]
Hence we have indeterminate form \\( \\frac{+\\infty}{+\\infty} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to+\\infty}\\frac{(e^x)'}{(\\ln(x))'}=\\lim_{x\\to+\\infty}\\frac{e^x}{\\frac{1}{x}}=+\\infty\\cdot+\\infty=+\\infty \\]
Therefore, it applies that:
\\[ \\lim_{x\\to+\\infty}\\frac{e^x}{\\ln(x)}=+\\infty \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to0^+}(x\\ln(x)) \\]`,
                            solution: `We have: \\[ \\lim_{x\\to0^+}x=0, \\lim_{x\\to0^+}=-\\infty \\]
Hence we have indeterminate form \\( 0\\cdot(-\\infty) \\), but we can't calculate this limit, so we will convert it to a fraction in order to apply De L'Hospital's Rule.
\\[ \\lim_{x\\to0^+}(x\\ln(x))=\\lim_{x\\to0^+}\\frac{\\ln(x)}{\\frac{1}{x}} \\]
Hence we have indeterminate form \\( \\frac{-\\infty}{+\\infty} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0^+}\\frac{(\\ln(x))'}{(\\frac{1}{x})'}=\\lim_{x\\to0^+}\\frac{\\frac{1}{x}}{-\\frac{1}{x^2}}=-\\lim_{x\\to0^+}x=0 \\]
Therefore, it applies that:
\\[ \\lim_{x\\to0^+}(x\\ln(x))=0 \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to0^+}(\\frac{1}{x}-\\frac{1}{e^x-1}) \\]`,
                            solution: `We have: \\[ \\lim_{x\\to0^+}\\frac{1}{x}=+\\infty,\\ \\lim_{x\\to0^+}\\frac{1}{e^x-1}=+\\infty \\]
Hence we have indeterminate form \\( (+\\infty)-(+\\infty) \\), but we can't calculate this limit, so we will convert it to a fraction in order to apply De L'Hospital's Rule.
\\[ \\lim_{x\\to0^+}(\\frac{1}{x}-\\frac{1}{e^x-1})=\\lim_{x\\to0^+}\\frac{e^x-1-x}{x(e^x-1)} \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0^+}\\frac{(e^x-1-x)'}{(x(e^x-1))'}=\\lim_{x\\to0^+}\\frac{e^x-1}{e^x+xe^x-1} \\]
But, \\[ \\lim_{x\\to0^+}(e^x-1)=0,\\ \\lim_{x\\to0^+}(e^x+xe^x-1)=0 \\]
So, we once again have the indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0^+}\\frac{(e^x-1)'}{(e^x+xe^x-1)'}=\\lim_{x\\to0^+}\\frac{e^x}{e^x+e^x+xe^x}=\\lim_{x\\to0^+}\\frac{e^x}{e^x(2+x)}=\\lim_{x\\to0^+}\\frac{1}{x+2}=\\frac{1}{2} \\]
Therefore, it applies that:
\\[ \\lim_{x\\to0^+}(\\frac{1}{x}-\\frac{1}{e^x-1})=\\frac{1}{2} \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Find the values of \\( a,b\\in\\mathbb{R} \\), so: \\[ \\lim_{x\\to0^+}\\frac{\\sin(3x)+ax+bx^3}{x^3}=0 \\]`,
                            solution: `We have: \\[ \\lim_{x\\to0^+}(\\sin(3x)+ax+bx^3)=0,\\ \\lim_{x\\to0^+}x^3=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) and it applies that:
\\[ \\lim_{x\\to0^+}((\\sin(3x)+ax+bx^3)')=\\lim_{x\\to0^+}(3\\cos(3x)+a+3bx^2)=3+a \\] and, \\[ \\lim_{x\\to0^+}((x^3)')=\\lim_{x\\to0^+}(3x^2)=0 \\]
Now, since it applies that: \\[ \\lim_{x\\to0^+}\\frac{\\sin(3x)+ax+bx^3}{x^3}=0 \\]
Then, it must apply that: \\[ \\lim_{x\\to0^+}\\frac{3\\cos(3x)+a+3bx^2}{3x^2}=0 \\]
So we observe that if  \\( \\lim_{x\\to0^+}(3\\cos(3x)+a+3bx^2)=3+a\\ne0 \\) the above limit will not be finite.
Therefore, \\[ \\lim_{x\\to0^+}(3\\cos(3x)+a+3bx^2)=3+a=0 \\Rightarrow a=-3 \\]
\\[ \\Rightarrow \\lim_{x\\to0^+}\\frac{3\\cos(3x)-3+3bx^2}{3x^2}=0 \\]
But, we again have indeterminate form \\( \\frac{0}{0} \\)
\\[ \\lim_{x\\to0^+}\\frac{(3\\cos(3x)-3+3bx^2)'}{(3x^2)'}=\\lim_{x\\to0^+}\\frac{-9\\sin(3x)+6bx}{6x}=\\frac{-9}{2}\\lim_{x\\to0^+}\\frac{\\sin(3x)}{3x}+\\lim_{x\\to0^+}\\frac{6bx}{6x}=\\frac{-9}{2}+b \\Rightarrow \\frac{-9}{2}+b=0 \\Rightarrow b=\\frac{9}{2} \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to 2}\\frac{x^2-5x+6}{x^2-4} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to2}(x^2-5x+6)=0, \\lim_{x\\to2}(x^2-4)=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to2}\\frac{(x^2-5x+6)'}{(x^2-4)'}=\\lim_{x\\to2}\\frac{2x-5}{2x}=-\\frac{1}{4} \\]
Therefore, it applies that:
\\[ \\lim_{x\\to2}\\frac{x^2-5x+6}{x^2-4}=-\\frac{1}{4} \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to 0}\\frac{\\sqrt{1+x}-1}{x} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to0}(\\sqrt{1+x}-1)=0, \\lim_{x\\to0}(x)=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(\\sqrt{1+x}-1)'}{x'}=\\lim_{x\\to0}\\frac{\\frac{1}{2\\sqrt{1+x}}}{1}=\\frac{1}{2\\sqrt1}=\\frac{1}{2} \\]
Therefore, it applies that:
\\[ \\lim_{x\\to 0}\\frac{\\sqrt{1+x}-1}{x}=\\frac{1}{2} \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to 0}\\frac{x^2+x}{e^x-1} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to0}(x^2+x)=0, \\lim_{x\\to0}(e^x-1)=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(x^2+x)'}{(e^x-1)'}=\\lim_{x\\to0}\\frac{2x+1}{e^x}=\\frac{1}{1}=1 \\]
Therefore, it applies that:
\\[ \\lim_{x\\to 0}\\frac{x^2+x}{e^x-1}=1 \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to 1}\\frac{\\ln x}{x^2+x-2} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to1}(\\ln x)=0, \\lim_{x\\to1}(x^2+x-2)=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to 1}\\frac{(\\ln x)'}{(x^2+x-2)'}=\\lim_{x\\to 1}\\frac{\\frac{1}{x}}{2x+1}=\\frac{1}{3} \\]
Therefore, it applies that:
\\[ \\lim_{x\\to 1}\\frac{\\ln x}{x^2+x-2}=\\frac{1}{3} \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to 2}\\frac{x^2-4}{\\sin(x-2)} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to 2}(x^2-4)=0, \\lim_{x\\to 2}(\\sin(x-2))=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to 2}\\frac{(x^2-4)'}{(\\sin(x-2))'}=\\lim_{x\\to 2}\\frac{2x}{\\cos(x-2)}=\\frac{4}{1} \\]
Therefore, it applies that:
\\[ \\lim_{x\\to 2}\\frac{x^2-4}{\\sin(x-2)}=4 \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to 0}\\frac{1-\\cos(x^2)}{x^2\\sin(x^2)} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to 0}(1-\\cos(x^2))=0, \\lim_{x\\to 0}(x^2\\sin(x^2))=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to 0}\\frac{(1-\\cos(x^2))'}{(x^2\\sin(x^2))'}=\\lim_{x\\to 0}\\frac{2x\\sin(x^2)}{2x\\sin(x^2)+x^2\\cdot 2x\\cos(x^2)}=\\lim_{x\\to 0}\\frac{2x\\sin(x^2)}{2x(\\sin(x^2)+x^2\\cos(x^2))}=
\\lim_{x\\to 0}\\frac{\\sin(x^2)}{\\sin(x^2)+x^2\\cos(x^2)} \\]
But,
\\[ \\lim_{x\\to 0}(\\sin(x^2))=0,\\lim_{x\\to 0}(\\sin(x^2)+x^2\\cos(x^2))=0 \\]
So, we once again have the indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to 0}\\frac{(\\sin(x^2))'}{(\\sin(x^2)+x^2\\cos(x^2))'}=\\lim_{x\\to 0}\\frac{2x\\cos(x^2)}{2x\\cos(x^2)+2x\\cos(x^2)-x^2\\cdot 2x\\sin(x^2)}=\\lim_{x\\to 0}\\frac{\\cos(x^2)}{2\\cos(x^2)-x^2\\sin(x^2)}=\\frac{1}{2} \\]
Therefore, it applies that:
\\[ \\lim_{x\\to 0}\\frac{1-\\cos(x^2)}{x^2\\sin(x^2)}=\\frac{1}{2} \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to0}\\frac{e^x-e^{\\sin(x)}}{x-\\sin(x)} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to0}(e^x-e^{\\sin(x)})=0, \\lim_{x\\to0}(x-\\sin(x))=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(e^x-e^{\\sin(x)})'}{(x-\\sin(x))'}=\\lim_{x\\to0}\\frac{e^x-\\cos(x)e^{\\sin(x)}}{1-\\cos(x)} \\]
But,
\\[ \\lim_{x\\to0}(e^x-\\cos(x)e^{\\sin(x)})=0,\\lim_{x\\to0}(1-\\cos(x))=0 \\]
So, we once again have the indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(e^x-\\cos(x)e^{\\sin(x)})'}{(1-\\cos(x))'}=\\lim_{x\\to0}\\frac{e^x+\\sin(x)e^{\\sin(x)}-\\cos^2(x)e^{\\sin(x)}}{\\sin(x)} \\]
But,
\\[ \\lim_{x\\to0}(e^x+\\sin(x)e^{\\sin(x)}-\\cos^2(x)e^{\\sin(x)})=0,\\lim_{x\\to0}(\\sin(x))=0 \\]
So, we once again have the indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(e^x+\\sin(x)e^{\\sin(x)}-\\cos^2(x)e^{\\sin(x)})'}{\\sin(x)'}=\\lim_{x\\to0}\\frac{e^x+\\cos(x)e^{\\sin(x)}+\\sin(x)\\cos(x)e^{\\sin(x)}+2\\cos(x)\\sin(x)e^{\\sin(x)}-\\cos^3(x)e^{\\sin(x)}}{\\cos(x)}=\\frac{1+1+0+0-1}{1}=1 \\]
Therefore, it applies that:
\\[ \\lim_{x\\to0}\\frac{e^x-e^{\\sin(x)}}{x-\\sin(x)}=1 \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: ``,
                            solution: ``
                        },
                        {
                            passage: ``,
                            solution: ``
                        },
                        {
                            passage: ``,
                            solution: ``
                        },
                        {
                            passage: ``,
                            solution: ``
                        },
                        {
                            passage: ``,
                            solution: ``
                        },
                        {
                            passage: ``,
                            solution: ``
                        },
                        {
                            passage: ``,
                            solution: ``
                        },
                        {
                            passage: ``,
                            solution: ``
                        },
                        {
                            passage: ``,
                            solution: ``
                        },
                        {
                            passage: `Find the value of \\( a\\in\\mathbb{R} \\) so the function \\[ f(x)= \\begin{cases} \\frac{9x-3\\sin(3x)}{5x^3}, & x\\ne0 \\\\ a, & x=0 \\end{cases} \\] is continuous at \\( x=0 \\)`,
                            solution: `Since the function \\( f \\) is continuous at \\(x=0\\), it applies that: \\[ \\lim_{x\\to0^-}f(x)=\\lim_{x\\to0^+}f(x)=f(0) \\]
So it applies that: \\[ \\lim_{x\\to0}f(x)=f(0) \\implies a=\\lim_{x\\to0}\\frac{9x-3\\sin(3x)}{5x^3} \\]
But, 
\\[ \\lim_{x\\to0}(9x-3\\sin(3x))=0,\\lim_{x\\to0}(5x^3)=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(9x-3\\sin(3x))'}{(5x^3)'}=\\lim_{x\\to0}\\frac{9-9\\cos(3x)}{15x^2} \\]
But, 
\\[ \\lim_{x\\to0}(9-9\\cos(3x))=0,\\lim_{x\\to0}(15x^2)=0 \\]
So, we once again have the indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(9-9\\cos(3x))'}{(15x^2)'}=\\lim_{x\\to0}\\frac{27\\sin(3x)}{30x} \\]
But,
\\[ \\lim_{x\\to0}(27\\sin(3x))=0,\\lim_{x\\to0}(30x)=0 \\]
So, we once again have the indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(27\\sin(3x))'}{(30x)'}=\\lim_{x\\to0}\\frac{81\\cos(3x)}{30}=\\frac{81}{30}=\\frac{27}{10} \\]
Therefore, it applies that:
\\[ a=\\lim_{x\\to0}\\frac{9x-3\\sin(3x)}{5x^3}=\\frac{27}{10} \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: ``,
                            solution: ``,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to0}\\frac{x-\\sin(x)}{x-\\tan(x)} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to 0}(x-\\sin(x))=0, \\lim_{x\\to 0}(x-\\tan(x))=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(x-\\sin(x))'}{(x-\\tan(x))'}=\\lim_{x\\to0}\\frac{1-\\cos(x)}{1-\\sec^2(x)} \\]
But,
\\[ \\lim_{x\\to 0}(1-\\cos(x))=0,\\lim_{x\\to 0}(1-\\sec^2(x))=0 \\]
So, we once again have the indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(1-\\cos(x))'}{(1-\\sec^2(x))'}=\\lim_{x\\to0}\\frac{\\sin(x)}{-2\\sec(x)\\cdot \\sec(x)\\tan(x)}=\\lim_{x\\to0}\\frac{\\sin(x)}{-2\\frac{\\sin(x)}{\\cos^3(x)}}=
-\\frac{1}{2}\\lim_{x\\to0}\\cos^3(x)=-\\frac{1}{2} \\]
Therefore, it applies that:
\\[ \\lim_{x\\to0}\\frac{x-\\sin(x)}{x-\\tan(x)}=-\\frac{1}{2} \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to0}\\frac{\\arctan^2(x)}{x} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to 0}(\\arctan^2(x))=0, \\lim_{x\\to 0}(x)=0 \\]
Hence we have indeterminate form \\( \\frac{0}{0} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to0}\\frac{(\\arctan^2(x))'}{x'}=\\lim_{x\\to0}\\frac{2\\arctan(x)\\cdot \\frac{1}{1+x^2}}{1}=\\lim_{x\\to0}\\frac{2\\arctan(x)}{1+x^2}=0 \\]
Therefore, it applies that:
\\[ \\lim_{x\\to0}\\frac{\\arctan^2(x)}{x}=0 \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to2^+}\\frac{\\ln(x^3-8)}{\\ln(x^2-3x+2)} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to 2^+}(\\ln(x^3-8))=-\\infty, \\lim_{x\\to 2^+}(\\ln(x^2-3x+2))=-\\infty \\]
Hence we have indeterminate form \\( \\frac{-\\infty}{-\\infty} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to2^+}\\frac{\\ln(x^3-8)'}{\\ln(x^2-3x+2)'}=\\lim_{x\\to2^+}\\frac{\\frac{3x^2}{x^3-8}}{\\frac{2x-3}{x^2-3x+2}}=\\lim_{x\\to2^+}\\frac{3x^2\\cdot (x^2-3x+2)}{(x^3-8)\\cdot (2x-3)}=
\\lim_{x\\to2^+}\\frac{3x^2\\cdot (x-2)(x-1)}{(x-2)(x^2+2x+4)\\cdot (2x-3)}=\\lim_{x\\to2^+}\\frac{3x^2(x-1)}{(x^2+2x+4)(2x-3)}=\\frac{12}{12}=1 \\]
Therefore, it applies that:
\\[ \\lim_{x\\to2^+}\\frac{\\ln(x^3-8)}{\\ln(x^2-3x+2)}=1 \\]`,
                            tags: ["limits", "hospital"]
                        },
                        {
                            passage: `Calculate the limit: \\[ \\lim_{x\\to\\infty}\\frac{x}{\\ln(x)^3} \\]`,
                            solution: `We have: \\[ \\lim_{x\\to\\infty}(x)=\\infty, \\lim_{x\\to\\infty}(\\ln(x)^3)=\\infty \\]
Hence we have indeterminate form \\( \\frac{\\infty}{\\infty} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to\\infty}\\frac{x'}{(\\ln(x)^3)'}=\\lim_{x\\to\\infty}\\frac{1}{3\\ln(x)^2\\cdot\\frac{1}{x}}=\\lim_{x\\to\\infty}\\frac{x}{3\\ln(x)^2} \\]
But,
\\[ \\lim_{x\\to\\infty}(x)=\\infty, \\lim_{x\\to\\infty}(3\\ln(x)^2)=\\infty \\]
So, we once again have the indeterminate form \\( \\frac{\\infty}{\\infty} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to\\infty}\\frac{x'}{(3\\ln(x)^2)'}=\\lim_{x\\to\\infty}\\frac{1}{6\\ln(x)\\cdot\\frac{1}{x}}=\\lim_{x\\to\\infty}\\frac{x}{6\\ln(x)} \\]
But,
\\[ \\lim_{x\\to\\infty}(x)=\\infty,\\lim_{x\\to\\infty}(6\\ln(x))=\\infty \\]
So, we once again have the indeterminate form \\( \\frac{\\infty}{\\infty} \\) so we check if De L' Hospital conditions are satisfied:
\\[ \\lim_{x\\to\\infty}\\frac{x'}{(6\\ln(x))'}=\\lim_{x\\to\\infty}\\frac{1}{6\\frac{1}{x}}=\\infty \\]
Therefore, it applies that:
\\[ \\lim_{x\\to\\infty}\\frac{x}{\\ln(x)^3}=\\infty \\]`,
                            tags: ["limits", "hospital"]
                        }
                    ]
                },
                {
                    id: "rolle",
                    title: "Rolle's Theorem",
                    definition: `If \\( f:[a,b]\\to\\mathbb{R} \\) is a function, for which it applies that: <br/>
                                    (a) \\(f\\) is continuous in \\([a,b]\\) <br/>
                                    (b) \\(f\\) is differentiable in \\((a,b)\\)<br/>
                                    (c) \\(f(a) = f(b)\\)<br/>
                                    Then there exists at least one \\( \\xi\\in(a,b) \\) such, so that it applies \\( f'(\\xi)=0 \\)`,
                    problems: [
                        {
                            passage: ``,
                            solution: ``
                        }
                    ]
                }
            ]
        },
        {
            id: "inverse_trig_fun",
            title: "Inverse Trigonometric Functions",
            subunits: [
                {
                    id: "inverse_trig_functions",
                    title: "Inverse Trigonometric Functions",
                    definition: `Let function \\( f(x)=\\sin(x) \\) with domain \\( [-\\frac{\\pi}{2},\\frac{\\pi}{2}] \\) and range \\( [-1,1] \\). <br>
                    Then, \\(f\\) has an inverse function \\( f^{-1}:[-1,1]\\rightarrow [-\\frac{\\pi}{2},\\frac{\\pi}{2}] \\) which is denoted by \\( \\arcsin \\).<br>
                    The value of the function \\( f^{-1}=\\arcsin(x) \\) is an arc which belongs in the interval \\( [-\\frac{\\pi}{2},\\frac{\\pi}{2}] \\) and
                    specifically the arc with sine equal to \\( x\\in [-1,1] \\). <div></div> <br>
                    <div id="arcsinGraph" class="make_graph" options='arcsinGraphOptions'></div> <br>
                    Let function \\( f(x)=\\cos(x) \\) with domain \\( [0,\\pi] \\) and range \\( [-1,1] \\). <br>
                    Then, \\(f\\) has an inverse function \\( f^{-1}:[-1,1]\\rightarrow [0,\\pi] \\) which is denoted by \\( \\arccos \\).<br>
                    The value of the function \\( f^{-1}=\\arccos(x) \\) is an arc which belongs in the interval \\( [0,\\pi] \\) and
                    specifically the arc with sine equal to \\( x\\in [-1,1] \\). <div></div> <br>
                    <div id="arccosGraph" class="make_graph" options='arccosGraphOptions'></div>
                    `,
                    problems: [
                        {
                            passage: `Calculate: \\( \\arcsin(\\frac{1}{2}) \\)`,
                            solution: `\\[ \\arcsin(\\frac{1}{2})=a \\iff \\sin(a)=\\frac{1}{2}, a\\in [-\\frac{\\pi}{2},\\frac{\\pi}{2}] 
                            \\iff a=\\frac{\\pi}{6} \\]`,
                            tags: ["inverse_trig", "arcsin"]
                        },
                        {
                            passage: `Calculate: \\( \\arccos(0) \\)`,
                            solution: `\\[ \\arccos(0)=a \\iff \\cos(a)=0, a\\in [0,\\pi] 
                            \\iff a=\\frac{\\pi}{2} \\]`,
                            tags: ["inverse_trig", "arccos"]
                        },
                        {
                            passage: `Calculate: \\( \\arctan(-\\sqrt{3}) \\)`,
                            solution: `\\[ \\arctan(-\\sqrt{3})=a \\iff \\tan(a)=-\\sqrt{3}, a\\in (-\\frac{\\pi}{2},\\frac{\\pi}{2}) 
                            \\iff a=-\\frac{\\pi}{3} \\]`,
                            tags: ["inverse_trig", "arctan"]
                        },
                        {
                            passage: `Calculate: \\( \\arcsin(\\frac{\\sqrt{3}}{2}) \\)`,
                            solution: `\\[ \\arcsin(\\frac{\\sqrt{3}}{2})=a \\iff \\sin(a)=\\frac{\\sqrt{3}}{2}, a\\in [-\\frac{\\pi}{2},\\frac{\\pi}{2}] 
                            \\iff a=-\\frac{\\pi}{3} \\]`,
                            tags: ["inverse_trig", "arcsin"]
                        },
                    ]
                },
                {
                    id: "derivatives_inverse_trig",
                    title: "Derivatives of Inverse Trigonometric Functions",
                    definition: `The derivative of \\( f(x)=\\arcsin(x) \\) is: \\[ f'(x)=\\frac{1}{\\sqrt{1-x^2}} \\]
                    The derivative of \\( f(x)=\\arccos(x) \\) is: \\[ f'(x)=-\\frac{1}{\\sqrt{1-x^2}} \\]
                    The derivative of \\( f(x)=\\arctan(x) \\) is: \\[ f'(x)=\\frac{1}{1+x^2} \\]
                    `,
                    problems: [
                        {
                            passage: `Prove that: \\( \\frac{d}{dx}\\arcsin(x)=\\frac{1}{\\sqrt{1-x^2}} \\)`,
                            solution: `Let \\( a=\\arcsin(x) \\): \\[ a=\\arcsin(x) \\implies x=\\sin(a) \\implies 1=a'\\cos(a) \\]
                            \\[ \\implies a'=\\frac{1}{\\cos(a)} \\implies a'=\\frac{1}{\\sqrt{1-\\sin^2(x)}} \\implies a'=\\frac{1}{\\sqrt{1-x^2}} \\]`,
                            tags: ["inverse_trig", "derivative", "arcsin"]
                        },
                        {
                            passage: `Prove that: \\( \\frac{d}{dx}\\arccos(x)=-\\frac{1}{\\sqrt{1-x^2}} \\)`,
                            solution: `Let \\( a=\\arccos(x) \\): \\[ a=\\arccos(x) \\implies x=\\cos(a) \\implies 1=-a'\\sin(a) \\]
                            \\[ \\implies a'=-\\frac{1}{\\sin(a)} \\implies a'=-\\frac{1}{\\sqrt{1-\\cos^2(x)}} \\implies a'=-\\frac{1}{\\sqrt{1-x^2}} \\]`,
                            tags: ["inverse_trig", "derivative", "arccos"]
                        },
                        {
                            passage: `Prove that: \\( \\frac{d}{dx}\\arctan(x)=\\frac{1}{1+x^2} \\)`,
                            solution: `Let \\( a=\\arctan(x) \\): \\[ a=\\arctan(x) \\implies x=\\tan(a) \\implies 1=a'\\sec^2(a) \\]
                            \\[ \\implies a'=\\frac{1}{\\sec^2(a)} \\implies a'=\\frac{1}{1+\\tan^2(x)} \\implies a'=\\frac{1}{1+x^2} \\]`,
                            tags: ["inverse_trig", "derivative", "arctan"]
                        }
                    ]
                }
            ]
        }
    ]
};

const lang = {
    en_us: new Map([
        ["show_solution", "Show Solution"]
    ])
}