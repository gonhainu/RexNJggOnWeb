from flask import Flask
from flask import render_template, request, jsonify
import numpy as np
import json
from RexNJgg import RealSolution, RexNJgg

app = Flask(__name__)
ga = RexNJgg(2, lambda x: sum(x**2))


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/random', methods=['POST'])
def random():
    try:
        a = np.array(request.json['m'])
        x = np.random.randn(a, 2)
        return jsonify({'x1': x.tolist()})
    except Exception as e:
        print(e)
        return jsonify({'error': e})


@app.route('/init', methods=['POST'])
def init():
    # try:
    npop = int(request.json['npop'])
    population = ga.initialize(int(npop))
    population = [s.x.tolist() for s in population]
    evalue, best_solution = ga.get_best_evaluation_value()
    return jsonify({'population': population, 'evalue': evalue, 'bestsol': best_solution.tolist()})
    # except Exception as e:
    #     print(e)
    #     return jsonify({'error': e})


@app.route('/parents', methods=['POST'])
def select_parents():
    try:
        npar = request.json['npar']
        parents = ga.select_parents(int(npar))
        parents = [parent.x.tolist() for parent in parents]
        return jsonify({'parents': parents})
    except Exception as e:
        print(e)
        return jsonify({'error': e})

@app.route('/children', methods=['POST'])
def make_offsprint():
    try:
        nchi = request.json['nchi']
        children = ga.make_offspring(int(nchi))
        children = [child.x.tolist() for child in children]
        return jsonify({'children': children})
    except Exception as e:
        print(e)
        return jsonify({'error': e})


@app.route('/survival', methods=['POST'])
def survival_selection():
    try:
        npar = request.json['npar']
        population = ga.survival_selection(int(npar))
        population = [s.x.tolist() for s in population]
        evalue, best_solution = ga.get_best_evaluation_value()
        return jsonify({'population': population, 'bestvalue': evalue, 'bestsol': best_solution.tolist()})
    except Exception as e:
        print(e)
        return jsonify({'error': e})

if __name__ == '__main__':
    app.run(debug=True)
