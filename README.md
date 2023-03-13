
# Solve vehicle routing problem using Genetic Algorithm

## Usage

* clone the project
* chose the right paramaters and hit execute button
* when the algorithm done  from the aside select a route to see it on visual part 

## Vehicle Routing Problem (VRP)

The Vehicle Routing Problem (VRP) is a combinatorial optimization problem in which a set of customers must be served by a fleet of vehicles based on certain constraints and objectives. The main objective is to minimize the total distance traveled by the vehicles, while also satisfying constraints such as the capacity of each vehicle and the time window in which each customer must be served.

The problem can be modeled as a graph where each customer is represented as a node and the vehicles travel along the edges between the nodes. The graph may also include additional nodes representing depots, where the vehicles start and end their routes.

There are several variations of the VRP, including the capacitated VRP (CVRP), which imposes a limit on the amount of goods that can be delivered to each customer, the time-dependent VRP (TDVRP), which takes into account time-dependent travel times, and the VRP with time windows (VRPTW), which requires that each customer be served within a specific time window.

The VRP is an important problem in logistics and transportation, with applications in areas such as delivery routing, waste collection, and school bus routing. Efficient algorithms and heuristics have been developed to solve the problem, including genetic algorithms, tabu search, and ant colony optimization.

##  Genetic Algorithm (GA)

A genetic algorithm (GA) is a search-based optimization algorithm that is inspired by the process of natural selection and genetics. The goal of a GA is to find the optimal solution to a problem by iteratively generating and improving a population of candidate solutions.

The GA starts by randomly generating an initial population of candidate solutions (chromosomes), which represent possible solutions to the problem. Each chromosome is then evaluated using a fitness function that quantifies how well it solves the problem. The chromosomes with the highest fitness are selected for reproduction, and their genes (parts of the solution) are combined to create new offspring chromosomes. The offspring chromosomes are then subject to genetic operators such as mutation and crossover, which introduce variation into the population.

The new population of chromosomes is evaluated using the fitness function, and the process of selection, reproduction, and genetic operators is repeated until a satisfactory solution is found or a stopping criterion is met. The algorithm often converges to a good solution quickly, but there is no guarantee that it will find the optimal solution.

The GA has been successfully applied to a wide range of optimization problems, including function optimization, machine learning, scheduling, and resource allocation. It is a popular algorithm in the field of artificial intelligence and has been used in applications such as robotics, game playing, and image processing.